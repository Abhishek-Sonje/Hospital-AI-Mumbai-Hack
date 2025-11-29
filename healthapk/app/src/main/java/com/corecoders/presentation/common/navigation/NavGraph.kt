package com.corecoders.presentation.common.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.corecoders.presentation.ambulance.screen.AmbulanceScreen
import com.corecoders.presentation.aqi.screen.AQIScreen
import com.corecoders.presentation.auth.screen.LoginScreen
import com.corecoders.presentation.auth.screen.SignUpScreen
import com.corecoders.presentation.medical.screen.MedicalHistoryScreen

@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToSignUp = {
                    navController.navigate(Screen.SignUp.route)
                },
                onNavigateToHome = {
                    navController.navigate(Screen.Ambulance.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.SignUp.route) {
            SignUpScreen(
                onNavigateToLogin = {
                    navController.popBackStack()
                },
                onNavigateToHome = {
                    navController.navigate(Screen.Ambulance.route) {
                        popUpTo(Screen.SignUp.route) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.Ambulance.route) {
            AmbulanceScreen()
        }
        
        composable(Screen.AQI.route) {
            AQIScreen()
        }
        
        composable(Screen.Medical.route) {
            MedicalHistoryScreen()
        }
    }
}

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object SignUp : Screen("signup")
    object Ambulance : Screen("ambulance")
    object AQI : Screen("aqi")
    object Medical : Screen("medical")
}
