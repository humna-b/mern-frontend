import express from 'express';
import RegisterCoach from '../models/coach/coach.js';
import { Clerk } from '@clerk/clerk-sdk-node'; 
import User from '../models/user/user.js';
 
const router = express.Router();

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

router.post('/register-coach', async (req, res) => {
  try {
    const {
      userId,
      yearsOfExperience,
      certification,
      specialities,
      preferredSessionDuration,
      bio,
      languages
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    let user;
    try {
      user = await clerk.users.getUser(userId);
    } catch (err) {
      return res.status(404).json({ message: 'No account found for the provided userId' });
    }

    const existingCoach = await RegisterCoach.findOne({ userId });
    if (existingCoach) {
      return res.status(400).json({ message: 'Coach already registered for this user' });
    }

    const coach = new RegisterCoach({
      userId,
      yearsOfExperience,
      certification,
      specialities,
      preferredSessionDuration,
      bio,
      languages
    });

    await coach.save();

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        isCoach: true,
        coachProfile: {
          yearsOfExperience,
          certification,
          specialities,
          preferredSessionDuration,
          bio,
          languages
        }
      }
    }); 
      await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          isCoach: 'true',
          acceptedSessionsAsCoach: [],
          rejectedSessionsAsCoach: [],
          invitedSessionsAsCoach: [],
        }
      },
      { upsert: false, new: true }
    );


    return res.status(201).json({ message: 'Coach registered successfully', coach });

  } catch (error) {
    console.error('Register Coach Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}); 
router.get('/coaches', async (req, res) => {
  try {
    // Step 1: Get all users where isCoach === "true"
    const coaches = await User.find({ isCoach: 'true' }).lean();

    // Step 2: For each coach, get RegisterCoach data and merge
    const enrichedCoaches = await Promise.all(
      coaches.map(async (coach) => {
        const regData = await RegisterCoach.findOne({ userId: coach.clerkId }).lean();
        return {
          ...coach,
          coachDetails: regData || {}, // include as `coachDetails`
        };
      })
    );

    return res.status(200).json({ coaches: enrichedCoaches });
  } catch (error) {
    console.error('Error fetching coaches with details:', error);
    return res.status(500).json({ message: 'Failed to fetch coaches' });
  }
});

export const registerCoach =  router;
