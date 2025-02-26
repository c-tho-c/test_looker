connection: "airbnb_lyon"

# include all the views
include: "/views/**/*.view.lkml"

datagroup: airbnb_data_default_datagroup {
  # sql_trigger: SELECT MAX(id) FROM etl_log;;
  max_cache_age: "1 hour"
}

persist_with: airbnb_data_default_datagroup

explore: listing {}

explore: reviews {
  join: listing {
    type: left_outer 
    sql_on: ${reviews.listing_id} = ${listing.id} ;;
    relationship: many_to_one
  }
}

explore: review {
  join: listing {
    type: left_outer 
    sql_on: ${review.listing_id} = ${listing.id} ;;
    relationship: many_to_one
  }
}

explore: calendar {
  join: listing {
    type: left_outer 
    sql_on: ${calendar.listing_id} = ${listing.id} ;;
    relationship: many_to_one
  }
}

explore: neighbourhood {}

