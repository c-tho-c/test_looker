project_name: "airbnb_data"

application: test-looker-embed {
  label: "Looker Extension - Tabs"
  url: "https://localhost:8080/bundle.js"
  #file: "bundle.js"
  entitlements: {
    core_api_methods: ["me"] #Add more entitlements here as you develop new functionality
    use_embeds: yes
  }
}

visualization: {
  id: "kpi_viz"
  label: "KPI Blocks"
  file: "visualizations/kpi_viz.js"
  dependencies: [
    "https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.4/d3.min.js"
  ]
}
visualization: {
  id: "dynamic-table-viz"
  label: "Dynamic Hierarchical Table"
  file: "visualizations/dynamic_table.js"
  dependencies: [
    "https://code.jquery.com/jquery-3.6.0.min.js"
  ]
}
