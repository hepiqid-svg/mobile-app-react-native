/**
 * parser.js
 *
 * This module provides parsing functions for data fetched from various sources.
 */

import { Platform } from 'react-native';

/**
 * Parses a date string into a JavaScript Date object.
 * Handles different date formats.
 * @param {string} dateString The date string to parse.
 * @returns {Date | null} A Date object, or null if parsing fails.
 */
export const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  try {
    // Check for ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
    if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/)) {
      return new Date(dateString);
    }

    // Check for DD/MM/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const parts = dateString.split('/');
      return new Date(parts[2], parts[1] - 1, parts[0]); // Month is 0-indexed
    }

    // Check for MM/DD/YYYY format
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = dateString.split('/');
        return new Date(parts[2], parts[0] - 1, parts[1]); // Month is 0-indexed
    }

    // Attempt to parse with Date.parse (less reliable, but a fallback)
    const parsedDate = new Date(Date.parse(dateString));
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }

    return null; // Parsing failed
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
};

/**
 * Parses a string representation of currency into a float.
 * Handles different currency formats and locales.
 * @param {string} currencyString The currency string to parse.
 * @returns {number | null} The parsed currency value as a float, or null if parsing fails.
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) {
    return null;
  }

  try {
    // Remove currency symbols and commas
    const cleanedString = currencyString.replace(/[^\d.-]/g, '');

    // Replace commas with dots if necessary (European format)
    const normalizedString = cleanedString.replace(/,/g, '.');

    const parsedValue = parseFloat(normalizedString);

    if (isNaN(parsedValue)) {
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.error("Error parsing currency:", currencyString, error);
    return null;
  }
};


/**
 * Parses a JSON string. Handles potential errors during parsing.
 * @param {string} jsonString The JSON string to parse.
 * @returns {object | null} The parsed JSON object, or null if parsing fails.
 */
export const parseJson = (jsonString) => {
  if (!jsonString) {
    return null;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", jsonString, error);
    return null;
  }
};

/**
 * Sanitizes a string for display in the UI.
 * This includes escaping HTML entities to prevent XSS vulnerabilities.
 * @param {string} str The string to sanitize.
 * @returns {string} The sanitized string.
 */
export const sanitizeString = (str) => {
  if (!str) {
    return "";
  }

  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return m;
    }
  });
};