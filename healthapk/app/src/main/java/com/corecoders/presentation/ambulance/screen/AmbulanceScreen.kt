package com.corecoders.presentation.ambulance.screen

import android.Manifest
import android.location.Location
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.corecoders.data.model.HospitalRecommendation
import com.corecoders.presentation.ambulance.viewmodel.AmbulanceUiState
import com.corecoders.presentation.ambulance.viewmodel.AmbulanceViewModel
import com.corecoders.utils.LocationHelper
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import kotlinx.coroutines.launch
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

@OptIn(ExperimentalPermissionsApi::class, ExperimentalMaterial3Api::class)
@Composable
fun AmbulanceScreen(
    viewModel: AmbulanceViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val locationHelper = remember { LocationHelper(context) }
    val scope = rememberCoroutineScope()

    var currentLocation by remember { mutableStateOf<Location?>(null) }
    var symptom by remember { mutableStateOf("") }
    var severity by remember { mutableStateOf<String?>(null) }
    var showSymptomDialog by remember { mutableStateOf(false) }
    var showHospitalSelection by remember { mutableStateOf(false) }
    var isUrgentBooking by remember { mutableStateOf(false) }

    val uiState by viewModel.uiState.collectAsState()
    val selectedHospital by viewModel.selectedHospital.collectAsState()

    val locationPermissions = rememberMultiplePermissionsState(
        permissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
    )

    // Get location on permission granted
    LaunchedEffect(locationPermissions.allPermissionsGranted) {
        if (locationPermissions.allPermissionsGranted) {
            scope.launch {
                currentLocation = locationHelper.getCurrentLocation()
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Emergency Ambulance") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                !locationPermissions.allPermissionsGranted -> {
                    // Permission request UI
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            modifier = Modifier.size(80.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Location Permission Required",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "We need your location to find the nearest hospitals and ambulances",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = { locationPermissions.launchMultiplePermissionRequest() },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Grant Permission")
                        }
                    }
                }

                currentLocation == null -> {
                    // Loading location
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator()
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("Getting your location...")
                        }
                    }
                }

                showHospitalSelection && uiState is AmbulanceUiState.Success -> {
                    // Hospital list view
                    HospitalListView(
                        hospitals = (uiState as AmbulanceUiState.Success).hospitals,
                        onHospitalSelected = { hospital ->
                            viewModel.selectHospital(hospital)
                        },
                        onBack = {
                            showHospitalSelection = false
                            viewModel.clearSelection()
                        }
                    )
                }

                selectedHospital != null -> {
                    // Selected hospital detail view
                    HospitalDetailView(
                        hospital = selectedHospital!!,
                        userLocation = currentLocation!!,
                        onConfirmBooking = {
                            // TODO: Implement actual ambulance booking
                        },
                        onBack = {
                            viewModel.clearSelection()
                            showHospitalSelection = false
                        }
                    )
                }

                else -> {
                    // Main booking options
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Location display
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.secondaryContainer
                            )
                        ) {
                            Row(
                                modifier = Modifier.padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.onSecondaryContainer
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "Your Location",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer
                                    )
                                    Text(
                                        text = "Lat: ${String.format("%.4f", currentLocation?.latitude)}, " +
                                                "Long: ${String.format("%.4f", currentLocation?.longitude)}",
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Emergency Fast Booking Button
                        Button(
                            onClick = {
                                isUrgentBooking = true
                                showSymptomDialog = true
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFFFF5252)
                            ),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Icon(
                                    Icons.Default.Emergency,
                                    contentDescription = null,
                                    modifier = Modifier.size(48.dp)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "EMERGENCY",
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Book Nearest Ambulance",
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                        }

                        // Regular Booking Button
                        OutlinedButton(
                            onClick = {
                                isUrgentBooking = false
                                showSymptomDialog = true
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.Center,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.LocalHospital, contentDescription = null)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "Select Hospital",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "Choose from available hospitals",
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }
                            }
                        }

                        // Info cards
                        Spacer(modifier = Modifier.height(16.dp))

                        InfoCard(
                            icon = Icons.Default.Speed,
                            title = "Average Response Time",
                            value = "8-12 minutes",
                            color = MaterialTheme.colorScheme.tertiaryContainer
                        )

                        InfoCard(
                            icon = Icons.Default.LocalHospital,
                            title = "Hospitals Available",
                            value = "24/7 Service",
                            color = MaterialTheme.colorScheme.primaryContainer
                        )
                    }
                }
            }

            // Loading overlay
            if (uiState is AmbulanceUiState.Loading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        modifier = Modifier.padding(32.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator()
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("Finding hospitals...")
                        }
                    }
                }
            }

            // Error snackbar
            if (uiState is AmbulanceUiState.Error) {
                Snackbar(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp),
                    action = {
                        TextButton(onClick = { viewModel.clearSelection() }) {
                            Text("Dismiss")
                        }
                    }
                ) {
                    Text((uiState as AmbulanceUiState.Error).message)
                }
            }
        }
    }

    // Symptom Dialog
    if (showSymptomDialog) {
        SymptomDialog(
            onDismiss = { showSymptomDialog = false },
            onConfirm = { enteredSymptom, selectedSeverity ->
                symptom = enteredSymptom
                severity = selectedSeverity
                showSymptomDialog = false

                currentLocation?.let { location ->
                    if (isUrgentBooking) {
                        viewModel.bookUrgentAmbulance(location, symptom)
                    } else {
                        viewModel.searchHospitals(location, symptom, severity)
                        showHospitalSelection = true
                    }
                }
            }
        )
    }
}

@Composable
fun InfoCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    value: String,
    color: Color
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = color)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(40.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.bodySmall
                )
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
fun SymptomDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String?) -> Unit
) {
    var symptom by remember { mutableStateOf("") }
    var severity by remember { mutableStateOf<String?>(null) }

    val commonSymptoms = listOf(
        "Chest Pain", "Difficulty Breathing", "Severe Headache",
        "Abdominal Pain", "High Fever", "Accident/Injury",
        "Heart Attack", "Stroke", "Other"
    )

    val severityLevels = listOf("Mild", "Moderate", "Severe")

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Describe Symptoms") },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Select or describe your symptoms",
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(16.dp))

                // Common symptoms chips
                Text("Common Symptoms:", style = MaterialTheme.typography.labelSmall)
                Spacer(modifier = Modifier.height(8.dp))
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    commonSymptoms.forEach { commonSymptom ->
                        FilterChip(
                            selected = symptom == commonSymptom,
                            onClick = { symptom = commonSymptom },
                            label = { Text(commonSymptom, style = MaterialTheme.typography.bodySmall) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Custom symptom input
                OutlinedTextField(
                    value = if (symptom in commonSymptoms) "" else symptom,
                    onValueChange = { symptom = it },
                    label = { Text("Or type custom symptom") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Severity selection
                Text("Severity:", style = MaterialTheme.typography.labelSmall)
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    severityLevels.forEach { level ->
                        FilterChip(
                            selected = severity == level,
                            onClick = { severity = level },
                            label = { Text(level) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onConfirm(symptom, severity) },
                enabled = symptom.isNotBlank()
            ) {
                Text("Continue")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun HospitalListView(
    hospitals: List<HospitalRecommendation>,
    onHospitalSelected: (HospitalRecommendation) -> Unit,
    onBack: () -> Unit
) {
    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
                Text(
                    text = "Select Hospital",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(hospitals) { hospital ->
                HospitalCard(
                    hospital = hospital,
                    onClick = { onHospitalSelected(hospital) }
                )
            }
        }
    }
}

@Composable
fun HospitalCard(
    hospital: HospitalRecommendation,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = hospital.hospitalName,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                InfoChip(
                    icon = Icons.Default.Place,
                    text = "${hospital.distanceKm} km"
                )
                InfoChip(
                    icon = Icons.Default.AccessTime,
                    text = "${hospital.predictedWaitingTimeMin.toInt()} min"
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                AssistChip(
                    onClick = {},
                    label = { Text("Beds: ${hospital.availableGeneralBeds}") },
                    leadingIcon = { Icon(Icons.Default.Bed, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
                AssistChip(
                    onClick = {},
                    label = { Text("ICU: ${hospital.availableIcuBeds}") },
                    leadingIcon = { Icon(Icons.Default.LocalHospital, contentDescription = null, modifier = Modifier.size(16.dp)) }
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Surface(
                color = when (hospital.recommendedAmbulanceType) {
                    "ALS" -> Color(0xFFFF5252)
                    "BLS" -> Color(0xFFFFA726)
                    else -> Color(0xFF66BB6A)
                },
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    text = "${hospital.recommendedAmbulanceType} Ambulance",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.White
                )
            }
        }
    }
}

@Composable
fun InfoChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String
) {
    Surface(
        color = MaterialTheme.colorScheme.secondaryContainer,
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(16.dp),
                tint = MaterialTheme.colorScheme.onSecondaryContainer
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSecondaryContainer
            )
        }
    }
}

@Composable
fun HospitalDetailView(
    hospital: HospitalRecommendation,
    userLocation: Location,
    onConfirmBooking: () -> Unit,
    onBack: () -> Unit
) {
    // Camera position state
    val hospitalLatLng = LatLng(hospital.hospitalLat, hospital.hospitalLng)
    val userLatLng = LatLng(userLocation.latitude, userLocation.longitude)

    // Calculate the center point between user and hospital
    val centerLat = (userLocation.latitude + hospital.hospitalLat) / 2
    val centerLng = (userLocation.longitude + hospital.hospitalLng) / 2
    val centerLatLng = LatLng(centerLat, centerLng)

    // Calculate zoom level based on distance
    val distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hospital.hospitalLat,
        hospital.hospitalLng
    )
    val zoomLevel = calculateZoomLevel(distance)

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(centerLatLng, zoomLevel)
    }

    var mapLoaded by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = hospital.hospitalName,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = hospital.speciality,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }

        // Google Maps View
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
        ) {
            GoogleMap(
                modifier = Modifier.fillMaxSize(),
                cameraPositionState = cameraPositionState,
                properties = MapProperties(
                    isMyLocationEnabled = false,
                    mapType = MapType.NORMAL
                ),
                uiSettings = MapUiSettings(
                    zoomControlsEnabled = true,
                    myLocationButtonEnabled = false,
                    compassEnabled = true,
                    scrollGesturesEnabled = true,
                    zoomGesturesEnabled = true
                ),
                onMapLoaded = { mapLoaded = true }
            ) {
                // User location marker (Blue)
                Marker(
                    state = MarkerState(position = userLatLng),
                    title = "Your Location",
                    snippet = "You are here",
                    icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)
                )

                // Hospital location marker (Red)
                Marker(
                    state = MarkerState(position = hospitalLatLng),
                    title = hospital.hospitalName,
                    snippet = "${hospital.distanceKm} km away • ${hospital.predictedWaitingTimeMin.toInt()} min wait",
                    icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)
                )

                // Route line between user and hospital
                Polyline(
                    points = listOf(userLatLng, hospitalLatLng),
                    color = MaterialTheme.colorScheme.primary,
                    width = 10f,
                    geodesic = true
                )

                // Distance circle around user (optional visual)
                Circle(
                    center = userLatLng,
                    radius = 500.0, // 500 meters
                    strokeColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f),
                    strokeWidth = 2f,
                    fillColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                )
            }

            // Loading indicator
            if (!mapLoaded) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            // Distance badge overlay
            Surface(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(16.dp),
                color = MaterialTheme.colorScheme.primaryContainer,
                shape = RoundedCornerShape(8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Route,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp),
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${hospital.distanceKm} km",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    DetailRow("Distance", "${hospital.distanceKm} km")
                    DetailRow("Waiting Time", "${hospital.predictedWaitingTimeMin.toInt()} minutes")
                    DetailRow("General Beds", "${hospital.availableGeneralBeds}")
                    DetailRow("ICU Beds", "${hospital.availableIcuBeds}")
                    DetailRow("Ventilators", "${hospital.availableVentilators}")
                    DetailRow("Traffic", hospital.trafficLevel)
                    DetailRow("Ambulance Type", hospital.recommendedAmbulanceType)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Navigation buttons row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        // Open Google Maps app for navigation
                        // You can implement this to open Google Maps
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Navigation, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Navigate")
                }

                Button(
                    onClick = {
                        // Recenter camera on route
                        // Could add animation here
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.CenterFocusStrong, contentDescription = null)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Recenter")
                }
            }
        }

        // Book button
        Button(
            onClick = onConfirmBooking,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .height(56.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFFFF5252)
            )
        ) {
            Icon(Icons.Default.Emergency, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Book Ambulance", style = MaterialTheme.typography.titleMedium)
        }
    }
}

// Helper function to calculate distance between two coordinates (Haversine formula)
fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val r = 6371.0 // Earth's radius in kilometers
    val dLat = Math.toRadians(lat2 - lat1)
    val dLon = Math.toRadians(lon2 - lon1)
    val a = sin(dLat / 2) * sin(dLat / 2) +
            cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
            sin(dLon / 2) * sin(dLon / 2)
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return r * c
}

// Helper function to calculate appropriate zoom level based on distance
fun calculateZoomLevel(distanceInKm: Double): Float {
    return when {
        distanceInKm < 1 -> 15f
        distanceInKm < 2 -> 14f
        distanceInKm < 5 -> 13f
        distanceInKm < 10 -> 12f
        distanceInKm < 20 -> 11f
        else -> 10f
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSecondaryContainer
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSecondaryContainer
        )
    }
}

@Composable
fun FlowRow(
    modifier: Modifier = Modifier,
    horizontalArrangement: Arrangement.Horizontal = Arrangement.Start,
    content: @Composable () -> Unit
) {
    Layout(
        content = content,
        modifier = modifier
    ) { measurables, constraints ->
        val placeables = measurables.map { it.measure(constraints) }
        var xPos = 0
        var yPos = 0
        var maxHeight = 0

        layout(constraints.maxWidth, constraints.maxHeight) {
            placeables.forEach { placeable ->
                if (xPos + placeable.width > constraints.maxWidth) {
                    xPos = 0
                    yPos += maxHeight
                    maxHeight = 0
                }
                placeable.place(xPos, yPos)
                xPos += placeable.width + 8.dp.roundToPx()
                maxHeight = maxOf(maxHeight, placeable.height + 8.dp.roundToPx())
            }
        }
    }
}