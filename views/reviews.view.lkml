view: reviews {
  sql_table_name: `charline_looker.reviews` ;;

  dimension_group: date {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    convert_tz: no
    datatype: date
    sql: ${TABLE}.date ;;
  }
  dimension: listing_id {
    type: number
    # hidden: yes
    sql: ${TABLE}.listing_id ;;
  }
  measure: count {
    type: count
    drill_fields: [listing.name, listing.id, listing.host_name]
  }
}
