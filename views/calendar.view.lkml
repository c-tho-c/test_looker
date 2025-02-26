view: calendar {
  sql_table_name: `charline_looker.calendar` ;;

  dimension: adjusted_price {
    type: string
    sql: ${TABLE}.adjusted_price ;;
  }
  dimension: available {
    type: yesno
    sql: ${TABLE}.available ;;
  }
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
  dimension: maximum_nights {
    type: number
    sql: ${TABLE}.maximum_nights ;;
  }
  dimension: minimum_nights {
    type: number
    sql: ${TABLE}.minimum_nights ;;
  }
  dimension: price {
    type: number
    sql: ${TABLE}.price ;;
  }
  measure: count {
    type: count
    drill_fields: [listing.name, listing.id, listing.host_name]
  }
}
