package com.corecoders.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.FirebaseDatabase
import com.corecoders.data.model.UserProfile
import com.corecoders.domain.repository.UserRepository
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject

class UserRepositoryImpl @Inject constructor(
    private val auth: FirebaseAuth,
    private val database: FirebaseDatabase
) : UserRepository {
    
    override fun signUp(email: String, password: String, userProfile: UserProfile): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            val userId = result.user?.uid ?: throw Exception("User ID not found")
            
            val updatedProfile = userProfile.copy(userId = userId, email = email)
            database.reference.child("users").child(userId).setValue(updatedProfile).await()
            
            emit(Resource.Success(userId))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Sign up failed"))
        }
    }
    
    override fun signIn(email: String, password: String): Flow<Resource<String>> = flow {
        try {
            emit(Resource.Loading())
            val result = auth.signInWithEmailAndPassword(email, password).await()
            val userId = result.user?.uid ?: throw Exception("User ID not found")
            emit(Resource.Success(userId))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Sign in failed"))
        }
    }
    
    override fun getUserProfile(userId: String): Flow<Resource<UserProfile>> = flow {
        try {
            emit(Resource.Loading())
            val snapshot = database.reference.child("users").child(userId).get().await()
            val profile = snapshot.getValue(UserProfile::class.java) 
                ?: throw Exception("Profile not found")
            emit(Resource.Success(profile))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Failed to load profile"))
        }
    }
    
    override fun updateUserProfile(userProfile: UserProfile): Flow<Resource<Unit>> = flow {
        try {
            emit(Resource.Loading())
            database.reference.child("users").child(userProfile.userId).setValue(userProfile).await()
            emit(Resource.Success(Unit))
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "Failed to update profile"))
        }
    }
    
    override fun getCurrentUserId(): String? = auth.currentUser?.uid
    
    override fun signOut() {
        auth.signOut()
    }
}
