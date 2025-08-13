import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOrCreateUser(auth0User: any) {
    try {
      this.logger.log(`Finding or creating user for Auth0 user data: ${JSON.stringify(auth0User)}`);

      // Handle both Auth0 user data format and simplified format
      let auth0Id: string;
      let email: string;
      let name: string;
      let picture: string;

      if (auth0User.sub) {
        // Full Auth0 user data format
        auth0Id = auth0User.sub;
        email = auth0User.email;
        name = auth0User.name;
        picture = auth0User.picture;
      } else if (auth0User.userId) {
        // Simplified format from expense service
        auth0Id = auth0User.userId;
        email = auth0User.email;
        name = auth0User.name;
        picture = auth0User.picture;
      } else {
        this.logger.error('No Auth0 ID found in user data');
        throw new Error('Invalid Auth0 user data: missing sub or userId field');
      }

      this.logger.log(`Extracted Auth0 ID: ${auth0Id}`);

      let user = await this.userModel.findOne({ auth0Id });
      this.logger.log(`User lookup result: ${user ? 'Found' : 'Not found'}`);

      if (!user) {
        this.logger.log(`Creating new user with Auth0 ID: ${auth0Id}`);

        // Create user with available data, use defaults if missing
        const newUser = new this.userModel({
          auth0Id,
          email: email || `user-${auth0Id}@temp.com`, // Temporary email if missing
          name: name || 'Unknown User',
          picture,
          monthlyExpenseLimit: 10000,
          currency: 'LKR',
        });

        this.logger.log(`Attempting to save user: ${JSON.stringify(newUser)}`);
        user = await newUser.save();
        this.logger.log(`New user created successfully with ID: ${user._id}`);
      } else {
        // Update user info if we have new data
        const updates: any = {};
        if (email && email !== user.email) updates.email = email;
        if (name && name !== user.name) updates.name = name;
        if (picture && picture !== user.picture) updates.picture = picture;
        
        if (Object.keys(updates).length > 0) {
          this.logger.log(`Updating user with new data: ${JSON.stringify(updates)}`);
          user = await this.userModel.findOneAndUpdate(
            { auth0Id },
            updates,
            { new: true }
          );
        }
      }

      return user;
    } catch (error) {
      this.logger.error(`Error in findOrCreateUser: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  async updateUserProfile(auth0Id: string, updates: Partial<User>) {
    this.logger.log(`Updating user profile for Auth0 ID: ${auth0Id}`);
    return this.userModel.findOneAndUpdate(
      { auth0Id },
      updates,
      { new: true }
    );
  }

  async getUserByAuth0Id(auth0Id: string) {
    this.logger.log(`Looking up user by Auth0 ID: ${auth0Id}`);
    const user = await this.userModel.findOne({ auth0Id });
    this.logger.log(`User lookup result: ${user ? 'Found' : 'Not found'}`);
    return user;
  }

  async getAllUsers() {
    this.logger.log('Fetching all users from database');
    const users = await this.userModel.find({});
    this.logger.log(`Found ${users.length} users in database`);
    return users;
  }
} 