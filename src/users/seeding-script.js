const { 
  auth, 
  createUserWithEmailAndPassword, 
  signOut,
} = require('./firebase-config.js');
const seedData = require('./seeds-data.js');

const seeding = function () {
  // initialize index to 0 to access each user data in the seedData array
  let index = 0;
  // save the interval ID returned from the setInterval method to stop the interval later
  const interval = setInterval(async () => {
    const user = seedData[index];
    // destructure the properties on the user object
    const {
      email,
      password,
      role
    } = user;
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        console.log('Created user in Authentication');
        // store the uid from the UserCredential returned from .createUserWithEmailAndPassword method
        const uid = response.user.uid;
        // create the data object with the same uid as above
        const data = {
          id: uid,
          email,
          role
        };
      })
      .catch((error) => console.log(error));
     await signOut(auth)
       .then(() => console.log('Sign out successful!'))
       .catch((error) => console.log(error));
    // increment index to access the different user data
    index += 1;
    // when we reach the end of the seedData array, remove the setInterval method
    if (index === seedData.length) clearInterval(interval);
  }, 2000);
};

seeding();