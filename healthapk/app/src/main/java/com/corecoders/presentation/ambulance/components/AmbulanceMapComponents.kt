package com.corecoders.presentation.ambulance.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.corecoders.data.model.HospitalRecommendation
import com.corecoders.utils.MapUtils
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import kotlinx.coroutines.delay

/**
 * Full-screen map view with real-time ambulance tracking simulation
 */
@Composable
fun AmbulanceTrackingMapView(
    hospital: HospitalRecommendation,
    userLatLng: LatLng,
    onClose: () -> Unit
) {
    val context = LocalContext.current
    val hospitalLatLng = LatLng(hospital.hospitalLat, hospital.hospitalLng)

    // Simulate ambulance movement
    var ambulanceProgress by remember { mutableStateOf(0f) }
    var ambulanceLatLng by remember { mutableStateOf(hospitalLatLng) }
    var estimatedTimeRemaining by remember {
        mutableStateOf(MapUtils.estimateTime(hospital.distanceKm, hospital.trafficLevel))
    }

    // Animate ambulance movement
    LaunchedEffect(Unit) {
        while (ambulanceProgress < 1f) {
            delay(1000) // Update every second
            ambulanceProgress += 0.01f // Move 1% closer each second

            // Calculate intermediate position
            val lat = hospitalLatLng.latitude +
                    (userLatLng.latitude - hospitalLatLng.latitude) * ambulanceProgress
            val lng = hospitalLatLng.longitude +
                    (userLatLng.longitude - hospitalLatLng.longitude) * ambulanceProgress

            ambulanceLatLng = LatLng(lat, lng)

            // Update ETA
            estimatedTimeRemaining = ((1 - ambulanceProgress) *
                    MapUtils.estimateTime(hospital.distanceKm, hospital.trafficLevel)).toInt()
        }
    }

    // Camera follows ambulance
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(ambulanceLatLng, 14f)
    }

    LaunchedEffect(ambulanceLatLng) {
        cameraPositionState.animate(
            CameraUpdateFactory.newLatLng(ambulanceLatLng),
            durationMs = 1000
        )
    }

    Dialog(onDismissRequest = onClose) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Box(modifier = Modifier.fillMaxSize()) {
                // Google Map
                GoogleMap(
                    modifier = Modifier.fillMaxSize(),
                    cameraPositionState = cameraPositionState,
                    properties = MapProperties(
                        mapType = MapType.NORMAL,
                        isTrafficEnabled = true
                    ),
                    uiSettings = MapUiSettings(
                        zoomControlsEnabled = false,
                        myLocationButtonEnabled = false
                    )
                ) {
                    // User location
                    Marker(
                        state = MarkerState(position = userLatLng),
                        title = "Your Location",
                        icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)
                    )

                    // Hospital location
                    Marker(
                        state = MarkerState(position = hospitalLatLng),
                        title = hospital.hospitalName,
                        icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)
                    )

                    // Ambulance marker (animated)
                    Marker(
                        state = MarkerState(position = ambulanceLatLng),
                        title = "Ambulance",
                        snippet = "En route to you",
                        icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN),
                        rotation = MapUtils.calculateBearing(
                            ambulanceLatLng.latitude,
                            ambulanceLatLng.longitude,
                            userLatLng.latitude,
                            userLatLng.longitude
                        )
                    )

                    // Route polyline
                    Polyline(
                        points = listOf(hospitalLatLng, userLatLng),
                        color = Color(0xFF4CAF50),
                        width = 8f,
                        geodesic = true
                    )

                    // Remaining route (from ambulance to user)
                    Polyline(
                        points = listOf(ambulanceLatLng, userLatLng),
                        color = Color(0xFFFF9800),
                        width = 10f,
                        geodesic = true
                    )
                }

                // Top info card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.TopCenter)
                        .padding(16.dp)
                ) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Ambulance En Route",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = hospital.hospitalName,
                                    style = MaterialTheme.typography.bodyMedium
                                )
                            }

                            IconButton(onClick = onClose) {
                                Icon(Icons.Default.Close, contentDescription = "Close")
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // ETA card with pulsing animation
                    ETACard(
                        timeRemaining = estimatedTimeRemaining,
                        ambulanceType = hospital.recommendedAmbulanceType,
                        progress = ambulanceProgress
                    )
                }

                // Bottom action buttons
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .padding(16.dp)
                ) {
                    // Contact buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { /* Call ambulance */ },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            )
                        ) {
                            Icon(Icons.Default.Phone, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Call")
                        }

                        Button(
                            onClick = {
                                MapUtils.openGoogleMapsNavigation(
                                    context,
                                    hospital.hospitalLat,
                                    hospital.hospitalLng,
                                    hospital.hospitalName
                                )
                            },
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Navigation, contentDescription = null)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Navigate")
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Share location button
                    OutlinedButton(
                        onClick = { /* Share location */ },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Share Location with Emergency Contact")
                    }
                }
            }
        }
    }
}

@Composable
fun ETACard(
    timeRemaining: Int,
    ambulanceType: String,
    progress: Float
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when {
                timeRemaining <= 5 -> Color(0xFF4CAF50)
                timeRemaining <= 10 -> Color(0xFFFFA726)
                else -> Color(0xFFFF5252)
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Surface(
                    modifier = Modifier.size(60.dp),
                    shape = CircleShape,
                    color = Color.White.copy(alpha = 0.3f)
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.padding(8.dp)
                    ) {
                        Icon(
                            Icons.Default.LocalHospital,
                            contentDescription = null,
                            modifier = Modifier.size(32.dp),
                            tint = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(
                        text = if (timeRemaining > 0) {
                            "$timeRemaining min"
                        } else {
                            "Arriving"
                        },
                        style = MaterialTheme.typography.displaySmall,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "$ambulanceType Ambulance",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Progress bar
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp),
                color = Color.White,
                trackColor = Color.White.copy(alpha = 0.3f),
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "${(progress * 100).toInt()}% complete",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.9f)
            )
        }
    }
}

/**
 * Mini map preview component for hospital cards
 */
@Composable
fun MiniMapPreview(
    hospitalLatLng: LatLng,
    userLatLng: LatLng,
    modifier: Modifier = Modifier
) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(
            LatLng(
                (hospitalLatLng.latitude + userLatLng.latitude) / 2,
                (hospitalLatLng.longitude + userLatLng.longitude) / 2
            ),
            12f
        )
    }

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp)
    ) {
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState,
            properties = MapProperties(mapType = MapType.NORMAL),
            uiSettings = MapUiSettings(
                zoomControlsEnabled = false,
                scrollGesturesEnabled = false,
                zoomGesturesEnabled = false,
                rotationGesturesEnabled = false,
                tiltGesturesEnabled = false
            )
        ) {
            Marker(
                state = MarkerState(position = userLatLng),
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)
            )
            Marker(
                state = MarkerState(position = hospitalLatLng),
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)
            )
            Polyline(
                points = listOf(userLatLng, hospitalLatLng),
                color = Color(0xFF2196F3),
                width = 5f
            )
        }
    }
}

/**
 * Ambulance icon with rotation animation
 */
@Composable
fun AnimatedAmbulanceIcon(
    modifier: Modifier = Modifier,
    rotation: Float = 0f
) {
    val infiniteTransition = rememberInfiniteTransition(label = "siren")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(500),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        // Pulsing red circle (siren effect)
        Surface(
            modifier = Modifier.size(40.dp),
            shape = CircleShape,
            color = Color.Red.copy(alpha = alpha * 0.3f)
        ) {}

        Icon(
            Icons.Default.LocalHospital,
            contentDescription = "Ambulance",
            modifier = Modifier
                .size(24.dp)
                .rotate(rotation),
            tint = Color.Red
        )
    }
}