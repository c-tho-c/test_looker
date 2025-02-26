view: listing {
  sql_table_name: `charline_looker.listing` ;;
  drill_fields: [id]

  dimension: id {
    primary_key: yes
    type: number
    sql: ${TABLE}.id ;;
  }
  dimension: availability_365 {
    type: number
    sql: ${TABLE}.availability_365 ;;
  }
  dimension: calculated_host_listings_count {
    type: number
    sql: ${TABLE}.calculated_host_listings_count ;;
  }
  dimension: host_id {
    type: number
    sql: ${TABLE}.host_id ;;
  }
  dimension: host_name {
    type: string
    sql: ${TABLE}.host_name ;;
  }
  dimension_group: last_review {
    type: time
    timeframes: [raw, date, week, month, quarter, year]
    convert_tz: no
    datatype: date
    sql: ${TABLE}.last_review ;;
  }
  dimension: listing_location {
    type:  location
    sql_latitude: ${latitude} ;;
    sql_longitude:  ${longitude} ;;
  }
  dimension: latitude {
    type: number
    sql: ${TABLE}.latitude ;;
  }
  dimension: license {
    type: string
    sql: ${TABLE}.license ;;
  }
  dimension: longitude {
    type: number
    sql: ${TABLE}.longitude ;;
  }
  dimension: minimum_nights {
    type: number
    sql: ${TABLE}.minimum_nights ;;
  }
  dimension: name {
    type: string
    sql: ${TABLE}.name ;;
  }
  dimension: neighbourhood {
    type: string
    sql: ${TABLE}.neighbourhood ;;
  }
  dimension: neighbourhood_group {
    type: string
    sql: ${TABLE}.neighbourhood_group ;;
  }
  dimension: number_of_reviews {
    type: number
    sql: ${TABLE}.number_of_reviews ;;
  }
  dimension: number_of_reviews_ltm {
    type: number
    sql: ${TABLE}.number_of_reviews_ltm ;;
  }
  dimension: price {
    type: number
    sql: ${TABLE}.price ;;
  }
  dimension: reviews_per_month {
    type: number
    sql: ${TABLE}.reviews_per_month ;;
  }
  dimension: room_type {
    type: string
    sql: ${TABLE}.room_type ;;
  }
  measure: average_price {
    sql:  ${TABLE}.price ;;
    type: average
    drill_fields: [id, name, host_name, reviews.count]
  }

  measure: count {
    type: count
    drill_fields: [detail*]
  }

  # ----- Sets of fields for drilling ------
  set: detail {
    fields: [
  id,
  name,
  host_name,
  reviews.count,
  review.count,
  calendar.count
  ]
  }

}
