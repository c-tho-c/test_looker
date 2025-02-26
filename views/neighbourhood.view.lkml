view: neighbourhood {
  sql_table_name: `charline_looker.neighbourhood` ;;

  dimension: string_field_0 {
    type: string
    sql: ${TABLE}.string_field_0 ;;
  }
  dimension: string_field_1 {
    type: string
    sql: ${TABLE}.string_field_1 ;;
  }
  measure: count {
    type: count
  }
}
