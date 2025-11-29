package com.corecoders.presentation.auth.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.corecoders.data.model.UserProfile
import com.corecoders.domain.repository.UserRepository
import com.corecoders.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {
    
    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()
    
    fun signUp(email: String, password: String, userProfile: UserProfile) {
        viewModelScope.launch {
            userRepository.signUp(email, password, userProfile).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _authState.value = AuthState.Loading
                    is Resource.Success -> _authState.value = AuthState.Success
                    is Resource.Error -> _authState.value = AuthState.Error(resource.message ?: "Unknown error")
                }
            }
        }
    }
    
    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            userRepository.signIn(email, password).collect { resource ->
                when (resource) {
                    is Resource.Loading -> _authState.value = AuthState.Loading
                    is Resource.Success -> _authState.value = AuthState.Success
                    is Resource.Error -> _authState.value = AuthState.Error(resource.message ?: "Unknown error")
                }
            }
        }
    }
    
    fun signOut() {
        userRepository.signOut()
        _authState.value = AuthState.Idle
    }
    
    fun resetState() {
        _authState.value = AuthState.Idle
    }
}

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    object Success : AuthState()
    data class Error(val message: String) : AuthState()
}
