'use strict'

import toSqlString from './to-sql-string'

/**
 * Builds a SQL query to insert a sequence of rows.
 *
 * @param {String} table The name of the destination table.
 * @param {Array.<String>} columns The names of the columns.
 * @param {Array.<Array|Map|Object>} rows The rows.
 * @param {Object} [options={}] The options.
 * @param {Boolean} [options.ignoreDuplicateKeys=false] A value indicating whether to ignore rows with duplicate keys.
 * @returns {String} The SQL query.
 */
export default function buildSqlInsertQuery(table, columns, rows, options) {
	if (typeof columns !== 'array')
		columns = Array.from(columns)
	if (columns.length === 0)
		return ''

	let sql = ''
	let recordCount = 0
	for (let row of rows) {
		// Build the SQL before the row.
		if (recordCount === 0)
			sql += 'INSERT INTO ' + table + '(' + columns.join(', ') + ') VALUES ('
		else
			sql += ', ('

		// Build the SQL for the values of the row.
		if (row instanceof Map)
			sql += columns.map(function(column) {
				return toSqlString(row.get(column))
			}).join(', ')
		else if (Array.isArray(row) || row[Symbol.iterator] === 'function')
			sql += Array.from(row, function(value) {
				return toSqlString(value)
			}).join(', ')
		else
			sql += columns.map(function(column) {
				return toSqlString(row[column])
			}).join(', ')

		sql += ')'
		++recordCount
	}

	// Build the SQL to ignore rows with duplicate keys.
	if (options?.ignoreDuplicateKeys)
		sql += ' ON DUPLICATE KEY UPDATE ' + columns
			.map(function(column) {
				return column + ' = ' + column
			})
			.join(', ')

	return sql
}
