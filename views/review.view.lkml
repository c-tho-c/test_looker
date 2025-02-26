view: review {
  sql_table_name: `charline_looker.review` ;;
  drill_fields: [id]

  dimension: id {
    primary_key: yes
    type: number
    sql: ${TABLE}.id ;;
  }
  dimension: comments {
    type: string
    sql: ${TABLE}.comments ;;
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
  dimension: reviewer_id {
    type: number
    sql: ${TABLE}.reviewer_id ;;
  }
  dimension: reviewer_name {
    type: string
    sql: ${TABLE}.reviewer_name ;;
  }
  measure: count {
    type: count
    drill_fields: [id, reviewer_name, listing.name, listing.id, listing.host_name]
  }
}
