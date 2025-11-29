package com.corecoders.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.google.android.gms.maps.model.LatLng

object MapUtils {

    /**
     * Open Google Maps app for turn-by-turn navigation
     */
    fun openGoogleMapsNavigation(
        context: Context,
        destinationLat: Double,
        destinationLng: Double,
        destinationName: String
    ) {
        val uri = Uri.parse(
            "google.navigation:q=$destinationLat,$destinationLng&mode=d"
        )
        val intent = Intent(Intent.ACTION_VIEW, uri)
        intent.setPackage("com.google.android.apps.maps")

        if (intent.resolveActivity(context.packageManager) != null) {
            context.startActivity(intent)
        } else {
            // Fallback to web browser
            openGoogleMapsWeb(context, destinationLat, destinationLng, destinationName)
        }
    }

    /**
     * Open Google Maps in web browser
     */
    fun openGoogleMapsWeb(
        context: Context,
        destinationLat: Double,
        destinationLng: Double,
        destinationName: String
    ) {
        val uri = Uri.parse(
            "https://www.google.com/maps/dir/?api=1&destination=$destinationLat,$destinationLng"
        )
        val intent = Intent(Intent.ACTION_VIEW, uri)
        context.startActivity(intent)
    }

    /**
     * Calculate bearing between two points (for ambulance direction)
     */
    fun calculateBearing(
        startLat: Double,
        startLng: Double,
        endLat: Double,
        endLng: Double
    ): Float {
        val startLatRad = Math.toRadians(startLat)
        val startLngRad = Math.toRadians(startLng)
        val endLatRad = Math.toRadians(endLat)
        val endLngRad = Math.toRadians(endLng)

        val dLng = endLngRad - startLngRad

        val y = Math.sin(dLng) * Math.cos(endLatRad)
        val x = Math.cos(startLatRad) * Math.sin(endLatRad) -
                Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng)

        val bearing = Math.toDegrees(Math.atan2(y, x))
        return ((bearing + 360) % 360).toFloat()
    }

    /**
     * Get intermediate points for route polyline
     */
    fun getIntermediatePoints(
        start: LatLng,
        end: LatLng,
        numPoints: Int = 10
    ): List<LatLng> {
        val points = mutableListOf<LatLng>()

        for (i in 0..numPoints) {
            val fraction = i.toDouble() / numPoints
            val lat = start.latitude + (end.latitude - start.latitude) * fraction
            val lng = start.longitude + (end.longitude - start.longitude) * fraction
            points.add(LatLng(lat, lng))
        }

        return points
    }

    /**
     * Format distance for display
     */
    fun formatDistance(distanceInKm: Double): String {
        return when {
            distanceInKm < 1 -> "${(distanceInKm * 1000).toInt()} m"
            else -> String.format("%.1f km", distanceInKm)
        }
    }

    /**
     * Estimate time based on distance and traffic
     */
    fun estimateTime(distanceInKm: Double, trafficLevel: String): Int {
        val baseSpeed = when (trafficLevel) {
            "Low" -> 40.0 // km/h
            "Moderate" -> 25.0
            "High" -> 15.0
            else -> 30.0
        }

        val timeInHours = distanceInKm / baseSpeed
        return (timeInHours * 60).toInt() // Convert to minutes
    }
}

/**
 * Extension function for LatLng
 */
fun LatLng.distanceTo(other: LatLng): Double {
    val r = 6371.0 // Earth's radius in km
    val dLat = Math.toRadians(other.latitude - this.latitude)
    val dLon = Math.toRadians(other.longitude - this.longitude)
    val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(this.latitude)) * Math.cos(Math.toRadians(other.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
    val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return r * c
}