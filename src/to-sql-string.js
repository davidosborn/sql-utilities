'use strict'

/**
 * Converts a value to a SQL string.
 *
 * @param value The value to convert.
 * @returns {String} The SQL string.
 */
export default function toSqlString(value) {
	return (
		// Handle the case where the value defines the conversion.
		value != null && value.toSqlString !== undefined ? value.toSqlString() :
		// Handle the case where the value is a string.
		typeof value === 'string' || value instanceof String ? '\'' + value.replace('\'', '\\\'') + '\'' :
		// Handle the case where the value is a date.
		value instanceof Date ? 'FROM_UNIXTIME(' + value.getTime() / 1000 + ')' :
		// Handle all other cases.
		'' + value
	)
}
