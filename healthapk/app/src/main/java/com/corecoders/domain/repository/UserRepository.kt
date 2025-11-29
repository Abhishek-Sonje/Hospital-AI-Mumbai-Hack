package com.corecoders.domain.repository

import com.corecoders.data.model.UserProfile
import com.corecoders.utils.Resource
import kotlinx.coroutines.flow.Flow

interface UserRepository {
    fun signUp(email: String, password: String, userProfile: UserProfile): Flow<Resource<String>>
    fun signIn(email: String, password: String): Flow<Resource<String>>
    fun getUserProfile(userId: String): Flow<Resource<UserProfile>>
    fun updateUserProfile(userProfile: UserProfile): Flow<Resource<Unit>>
    fun getCurrentUserId(): String?
    fun signOut()
}
