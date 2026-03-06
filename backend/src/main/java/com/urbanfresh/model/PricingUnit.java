package com.urbanfresh.model;

/**
 * Domain Layer – Pricing unit for a product.
 * Determines how the price is expressed on product cards and in the catalogue.
 *
 * PER_ITEM — flat price per individual unit (default)
 * PER_KG   — price per kilogram
 * PER_G    — price per gram
 * PER_L    — price per litre
 * PER_ML   — price per millilitre
 */
public enum PricingUnit {
    PER_ITEM,
    PER_KG,
    PER_G,
    PER_L,
    PER_ML
}
