import { doc, where, getDoc, increment, setDoc, getDocs, query, collection } from 'firebase/firestore';
import { db } from '../firebase';
import Date from '../utils/Date';
import { markReferralsClaimed, getAll as getAllReferrals } from './referral';

function getProfileDocRef(address) {
  const normalizedId = address.toLowerCase();
  return {
    normalizedId,
    docRef: doc(db, 'uht_crypto_profile', normalizedId),
  };
}

async function updateSurveyAnswer(questionID, answerID, answeredCorrectly) {
  const walletAddress = useAuth().value.walletAddress;
  const { normalizedId, docRef } = getProfileDocRef(walletAddress);

  const item = {
    address: walletAddress,
    walletAddressLower: normalizedId,
    lastAnsweredQuestionID: questionID,
    lastAnswerID: answerID,
  };

  if (answeredCorrectly) {
    item.points = increment(50);
  }

  await setDoc(docRef, item, { merge: true });

  useAuth().value.lastAnsweredQuestionID = questionID;
  useAuth().value.lastAnswerID = answerID;
  if (answeredCorrectly) {
    useAuth().value.points = (useAuth().value.points || 0) + 50;
  }
}

async function updateUserHasClaimedPoints() {
  const walletAddress = useAuth().value.walletAddress;
  const { normalizedId, docRef } = getProfileDocRef(walletAddress);

  await setDoc(
    docRef,
    {
      address: walletAddress,
      walletAddressLower: normalizedId,
      hasClaimedPoints: true,
      points: 0,
    },
    { merge: true }
  );

  await markReferralsClaimed(walletAddress);
  const referrals = await getAllReferrals(walletAddress);

  useAuth().value.hasClaimedPoints = true;
  useAuth().value.points = 0;
  useAuth().value.referrals = referrals || [];
}

async function getUser(address) {
  const normalized = address.toLowerCase();

  const q = query(
    collection(db, 'uht_crypto_profile'),
    where('walletAddressLower', '==', normalized)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;

  return querySnapshot.docs[0].data();
}

async function addWalletAddressLowerField() {
  try {
    const colRef = collection(db, 'uht_crypto_profile');
    const snapshot = await getDocs(colRef);

    console.log('Total docs found:', snapshot.size);

    if (snapshot.empty) {
      console.log('No documents found in uht_crypto_profile');
      return;
    }

    for (const document of snapshot.docs) {
      const data = document.data();
      console.log('Processing:', document.id);

      const address = data.address;
      if (!address) {
        console.log('No walletAddress field for', document.id);
        continue;
      }

      await setDoc(
        doc(db, 'uht_crypto_profile', document.id),
        {
          walletAddressLower: address.toLowerCase(),
        },
        { merge: true }
      );

      console.log(`Updated: ${document.id}`);
    }

    console.log('walletAddressLower field added successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

async function create(address) {
  const { normalizedId, docRef } = getProfileDocRef(address);
  const item = {
    address,
    walletAddressLower: normalizedId,
    points: 0,
    dateCreated: new Date().toJSON(),
  };

  await setDoc(docRef, item, { merge: true });
  return item;
}

async function updateUser(item) {
  const auth = useAuth();
  const walletAddress = auth.value.walletAddress;
  const { normalizedId, docRef } = getProfileDocRef(walletAddress);

  await setDoc(
    docRef,
    {
      address: walletAddress,
      walletAddressLower: normalizedId,
      ...item,
    },
    { merge: true }
  );

  const user = await getUser(walletAddress);

  auth.value.points = user?.points || 0;
  auth.value.hasClaimedPoints = user?.hasClaimedPoints || false;
  auth.value.lastAnsweredQuestionID = user?.lastAnsweredQuestionID || null;
  auth.value.lastAnswerID = user?.lastAnswerID || null;
  auth.value.email = user?.email || '';
  auth.value.username = user?.username || '';
}

async function updateAddressProfile(address, item) {
  const { normalizedId, docRef } = getProfileDocRef(address);

  await setDoc(
    docRef,
    {
      address,
      walletAddressLower: normalizedId,
      ...item,
    },
    { merge: true }
  );
}

async function addUserPoints(amountToAdd) {
  const walletAddress = useAuth().value.walletAddress;
  const { normalizedId, docRef } = getProfileDocRef(walletAddress);

  await setDoc(
    docRef,
    {
      address: walletAddress,
      walletAddressLower: normalizedId,
      points: increment(amountToAdd),
    },
    { merge: true }
  );

  useAuth().value.points = (useAuth().value.points || 0) + amountToAdd;
}

export {
  updateSurveyAnswer,
  updateUserHasClaimedPoints,
  getUser,
  create,
  updateUser,
  updateAddressProfile,
  addWalletAddressLowerField,
  addUserPoints,
};