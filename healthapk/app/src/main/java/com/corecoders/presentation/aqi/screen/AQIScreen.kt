package com.corecoders.presentation.aqi.screen

import android.Manifest
import android.location.Location
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.corecoders.data.model.DiseasePrediction
import com.corecoders.data.model.ResourceSummary
import com.corecoders.presentation.aqi.viewmodel.AQIUiState
import com.corecoders.presentation.aqi.viewmodel.AQIViewModel
import com.corecoders.utils.AQIResult
import com.corecoders.utils.LocationHelper
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import kotlinx.coroutines.launch

@OptIn(ExperimentalPermissionsApi::class, ExperimentalMaterial3Api::class)
@Composable
fun AQIScreen(
    viewModel: AQIViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val locationHelper = remember { LocationHelper(context) }
    val scope = rememberCoroutineScope()

    var currentLocation by remember { mutableStateOf<Location?>(null) }
    var city by remember { mutableStateOf("Mumbai") }
    var showCityDialog by remember { mutableStateOf(false) }

    val uiState by viewModel.uiState.collectAsState()
    val aqiData by viewModel.aqiData.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()
    val personalizedAdvisories by viewModel.personalizedAdvisories.collectAsState()

    val locationPermissions = rememberMultiplePermissionsState(
        permissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
    )

    // Get location and fetch data on permission granted
    LaunchedEffect(locationPermissions.allPermissionsGranted) {
        if (locationPermissions.allPermissionsGranted) {
            scope.launch {
                currentLocation = locationHelper.getCurrentLocation()
                currentLocation?.let {
                    viewModel.fetchAQIAndPredictions(it, city)
                }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Air Quality & Health")
                        Text(
                            text = city,
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { showCityDialog = true }) {
                        Icon(Icons.Default.LocationCity, contentDescription = "Change City")
                    }
                    IconButton(
                        onClick = {
                            currentLocation?.let {
                                viewModel.fetchAQIAndPredictions(it, city)
                            }
                        }
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                },
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
                            text = "We need your location to fetch air quality data for your area",
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

                uiState is AQIUiState.Loading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            CircularProgressIndicator()
                            Spacer(modifier = Modifier.height(16.dp))
                            Text("Analyzing air quality and health data...")
                        }
                    }
                }

                uiState is AQIUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.ErrorOutline,
                            contentDescription = null,
                            modifier = Modifier.size(80.dp),
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = (uiState as AQIUiState.Error).message,
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = {
                                currentLocation?.let {
                                    viewModel.fetchAQIAndPredictions(it, city)
                                }
                            }
                        ) {
                            Text("Retry")
                        }
                    }
                }

                uiState is AQIUiState.Success -> {
                    val successState = uiState as AQIUiState.Success
                    AQIContentView(
                        aqiData = aqiData,
                        predictions = successState.predictions,
                        summary = successState.summary,
                        personalizedAdvisories = personalizedAdvisories,
                        userAge = userProfile?.age
                    )
                }

                else -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Waiting for location...")
                    }
                }
            }
        }
    }

    // City selection dialog
    if (showCityDialog) {
        CitySelectionDialog(
            currentCity = city,
            onCitySelected = { newCity ->
                city = newCity
                showCityDialog = false
                currentLocation?.let {
                    viewModel.fetchAQIAndPredictions(it, newCity)
                }
            },
            onDismiss = { showCityDialog = false }
        )
    }
}

@Composable
fun AQIContentView(
    aqiData: AQIResult?,
    predictions: List<DiseasePrediction>,
    summary: ResourceSummary,
    personalizedAdvisories: List<String>,
    userAge: Int?
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // AQI Gauge
        item {
            aqiData?.let { data ->
                AQIGaugeCard(aqi = data.aqi)
            }
        }

        // Air Quality Parameters
        item {
            aqiData?.let { data ->
                AirQualityParametersCard(data)
            }
        }

        // Risk Level Summary
        item {
            RiskLevelCard(summary)
        }

        // Personalized Advisories
        if (personalizedAdvisories.isNotEmpty()) {
            item {
                Text(
                    text = "Personalized Health Advisory",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            items(personalizedAdvisories) { advisory ->
                AdvisoryCard(advisory)
            }
        }

        // Disease Surge Predictions
        item {
            Text(
                text = "Disease Surge Predictions",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }

        items(predictions) { prediction ->
            DiseasePredictionCard(prediction)
        }

        // Resource Summary
        item {
            ResourceSummaryCard(summary)
        }
    }
}

@Composable
fun AQIGaugeCard(aqi: Double) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = getAQIColor(aqi).copy(alpha = 0.2f)
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Air Quality Index",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))

            // AQI Gauge
            AQIGauge(aqi = aqi)

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = aqi.toInt().toString(),
                style = MaterialTheme.typography.displayLarge,
                fontWeight = FontWeight.Bold,
                color = getAQIColor(aqi)
            )

            Text(
                text = getAQICategory(aqi),
                style = MaterialTheme.typography.titleMedium,
                color = getAQIColor(aqi)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = getAQIDescription(aqi),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun AQIGauge(aqi: Double, modifier: Modifier = Modifier) {
    val animatedProgress = remember { Animatable(0f) }

    LaunchedEffect(aqi) {
        animatedProgress.animateTo(
            targetValue = (aqi / 500f).coerceIn(0.0, 1.0).toFloat(),
            animationSpec = tween(durationMillis = 1000, easing = EaseOutCubic)
        )
    }

    Canvas(modifier = modifier.size(200.dp)) {
        val strokeWidth = 30f
        val radius = (size.minDimension - strokeWidth) / 2
        val center = Offset(size.width / 2, size.height / 2)

        // Background arc
        drawArc(
            color = Color.LightGray.copy(alpha = 0.3f),
            startAngle = 135f,
            sweepAngle = 270f,
            useCenter = false,
            topLeft = Offset(center.x - radius, center.y - radius),
            size = Size(radius * 2, radius * 2),
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
        )

        // Progress arc
        drawArc(
            color = getAQIColor(aqi),
            startAngle = 135f,
            sweepAngle = 270f * animatedProgress.value,
            useCenter = false,
            topLeft = Offset(center.x - radius, center.y - radius),
            size = Size(radius * 2, radius * 2),
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
        )
    }
}

@Composable
fun AirQualityParametersCard(data: AQIResult) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Air Quality Parameters",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                ParameterItem("PM2.5", "${data.pm25.toInt()} µg/m³", Icons.Default.Cloud)
                ParameterItem("PM10", "${data.pm10.toInt()} µg/m³", Icons.Default.Cloud)
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                ParameterItem("Temperature", "${data.temperature.toInt()}°C", Icons.Default.Thermostat)
                ParameterItem("Humidity", "${data.humidity.toInt()}%", Icons.Default.Water)
            }

            if (data.rainfall > 0) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Start
                ) {
                ParameterItem("Rainfall", "${data.rainfall.toInt()} mm", Icons.Default.WaterDrop)
            }
        }
    }
}
}

@Composable
fun RowScope.ParameterItem(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Surface(
        modifier = Modifier.weight(1f), // Fixed usage of weight
        color = MaterialTheme.colorScheme.secondaryContainer,
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.onSecondaryContainer
            )
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
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
    }
}

@Composable
fun RiskLevelCard(summary: ResourceSummary) {
    val riskColor = when (summary.riskLevel) {
        "HIGH" -> Color(0xFFFF5252)
        "MODERATE" -> Color(0xFFFFA726)
        else -> Color(0xFF66BB6A)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = riskColor.copy(alpha = 0.2f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(60.dp),
                shape = CircleShape,
                color = riskColor
            ) {
                Box(
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        when (summary.riskLevel) {
                            "HIGH" -> Icons.Default.Warning
                            "MODERATE" -> Icons.Default.Info
                            else -> Icons.Default.CheckCircle
                        },
                        contentDescription = null,
                        modifier = Modifier.size(32.dp),
                        tint = Color.White
                    )
                }
            }
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = "${summary.riskLevel} RISK",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = riskColor
                )
                Text(
                    text = "${summary.totalSurgesDetected} disease surge(s) detected",
                    style = MaterialTheme.typography.bodyMedium
                )
            }
        }
    }
}

@Composable
fun AdvisoryCard(advisory: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.tertiaryContainer
        )
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                Icons.Default.Info,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onTertiaryContainer
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = advisory,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onTertiaryContainer
            )
        }
    }
}

@Composable
fun DiseasePredictionCard(prediction: DiseasePrediction) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (prediction.surgeFlag) {
                MaterialTheme.colorScheme.errorContainer
            } else {
                MaterialTheme.colorScheme.surfaceVariant
            }
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        if (prediction.surgeFlag) Icons.Default.Warning else Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = if (prediction.surgeFlag) {
                            MaterialTheme.colorScheme.error
                        } else {
                            MaterialTheme.colorScheme.primary
                        }
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = prediction.disease,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }

                if (prediction.surgeFlag) {
                    Surface(
                        color = MaterialTheme.colorScheme.error,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "SURGE",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                StatItem("Predicted Cases", "${prediction.predictedCases.toInt()}")
                StatItem("Baseline", "${prediction.baselineMedian.toInt()}")
                StatItem("Threshold", "${prediction.surgeThreshold.toInt()}")
            }

            Spacer(modifier = Modifier.height(12.dp))

            LinearProgressIndicator(
                progress = { (prediction.predictedCases / prediction.surgeThreshold).coerceAtMost(1.0).toFloat() },
                modifier = Modifier.fillMaxWidth(),
                color = if (prediction.surgeFlag) {
                    MaterialTheme.colorScheme.error
                } else {
                    MaterialTheme.colorScheme.primary
                }
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                AssistChip(
                    onClick = {},
                    label = { Text("Beds: ${prediction.bedsNeeded}") },
                    leadingIcon = { Icon(Icons.Default.Bed, null, Modifier.size(16.dp)) }
                )
                AssistChip(
                    onClick = {},
                    label = { Text("O₂: ${prediction.oxygenUnits}") },
                    leadingIcon = { Icon(Icons.Default.Air, null, Modifier.size(16.dp)) }
                )
                AssistChip(
                    onClick = {},
                    label = { Text("Staff: ${prediction.staffRequired}") },
                    leadingIcon = { Icon(Icons.Default.People, null, Modifier.size(16.dp)) }
                )
            }
        }
    }
}

@Composable
fun StatItem(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun ResourceSummaryCard(summary: ResourceSummary) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Total Resource Requirements",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            ResourceRow("Total Beds", summary.totalBeds.toString(), Icons.Default.Bed)
            ResourceRow("Oxygen Units", summary.totalOxygenUnits.toString(), Icons.Default.Air)
            ResourceRow("Ventilators", summary.totalVentilators.toString(), Icons.Default.Healing)
            ResourceRow("Staff Required", summary.totalStaffRequired.toString(), Icons.Default.People)
        }
    }
}

@Composable
fun ResourceRow(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium
            )
        }
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun CitySelectionDialog(
    currentCity: String,
    onCitySelected: (String) -> Unit,
    onDismiss: () -> Unit
) {
    val cities = listOf(
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
        "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
    )

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Select City") },
        text = {
            LazyColumn {
                items(cities) { city ->
                    TextButton(
                        onClick = { onCitySelected(city) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(city)
                            if (city == currentCity) {
                                Icon(Icons.Default.Check, contentDescription = null)
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

fun getAQIColor(aqi: Double): Color {
    return when {
        aqi <= 50 -> Color(0xFF66BB6A)  // Good - Green
        aqi <= 100 -> Color(0xFFFFEB3B) // Moderate - Yellow
        aqi <= 150 -> Color(0xFFFFA726) // Unhealthy for Sensitive - Orange
        aqi <= 200 -> Color(0xFFFF5252) // Unhealthy - Red
        aqi <= 300 -> Color(0xFF9C27B0) // Very Unhealthy - Purple
        else -> Color(0xFF880E4F)       // Hazardous - Maroon
    }
}

fun getAQICategory(aqi: Double): String {
    return when {
        aqi <= 50 -> "Good"
        aqi <= 100 -> "Moderate"
        aqi <= 150 -> "Unhealthy for Sensitive Groups"
        aqi <= 200 -> "Unhealthy"
        aqi <= 300 -> "Very Unhealthy"
        else -> "Hazardous"
    }
}

fun getAQIDescription(aqi: Double): String {
    return when {
        aqi <= 50 -> "Air quality is satisfactory"
        aqi <= 100 -> "Air quality is acceptable"
        aqi <= 150 -> "Members of sensitive groups may experience health effects"
        aqi <= 200 -> "Everyone may begin to experience health effects"
        aqi <= 300 -> "Health alert: everyone may experience more serious health effects"
        else -> "Health warnings of emergency conditions"
    }
}