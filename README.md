# App

GymPass style app.

## RFs

- [X] should be able to sign up
- [X] should be able to sign in
- [X] should be able to get a profile of a logged-in user
- [X] should be able to get the number of check-ins made by the authenticated user
- [X] should be able to get the authenticated user's check-in history
- [X] should be able to let user search for nearby gyms (within 10km)
- [X] should be able to let user search for gyms by name
- [X] should be able to let user check in at a gym
- [X] should be able to validate a user's check-in
- [X] should be able to register a gym

## RNs

- [X] should not be able to sign up with a duplicate email
- [X] should not be able to allow a user check-in twice on the same day
- [X] should not be able to check in if user isn't near the gym (100m)
- [X] should not be able to validate a check-in before 20 minutes have passed since its creation
- [] should not allow non-admin users to validate check-ins
- [] should not allow non-admin users to register a gym

## RNFs

- [X] the user's password must be encrypted
- [X] the aplication's data must be stored in a PostgreSQL database
- [X] every data list must be paginated with 20 items per page
- [] the user must be identified by a JWT (JSON Web Token)