```{
  "id": "azure",
  "unreleased": false,
  "categoryPriority": 10,
  "type": "architectural",
  "displayName": "Overview",
  "alertQuery": "(_exists_:resource_type)",
  "mtsQuery": "resource_type:Microsoft.Web\\/sites OR resource_type:Microsoft.Batch\\/batchAccounts OR resource_type:Microsoft.EventHub\\/namespaces OR resource_type:Microsoft.Logic\\/workflows OR resource_type:Microsoft.Cache\\/Redis OR resource_type:Microsoft.Sql/servers/databases OR resource_type:Microsoft.Storage\\/storageAccounts OR resource_type:Microsoft.Compute\\/virtualMachines",
  "category": "Azure",
  "discoveryQuery": [
    "_exists_:resource_type"
  ],
  "propertyColumns": [
    [
      {
        "header": "Other",
        "properties": []
      }
    ]
  ],
  "tooltipKeyList": [
    {
      "property": "value",
      "displayName": "Value",
      "isSummaryProperty": true,
      "format": "Number"
    }
  ],
  "map": {
    "job": {
      "resolution": 60000,
      "filters": [
        {
          "property": "primary_aggregation_type",
          "propertyValue": "true",
          "type": "property"
        }
      ],
      "template": "DTU_PERCENTAGE = data(\"dtu_consumption_percent\", filter=filter(\"resource_type\", \"Microsoft.Sql/servers/databases\"){{#filter}} and {{{filter}}}{{/filter}}, extrapolation=\"last_value\", maxExtrapolations=5).mean(by=[\"azure_resource_name\"])\nVM_CPU = data(\"Percentage CPU\", filter=(filter(\"resource_type\", \"Microsoft.Compute/virtualMachines\") or filter(\"resource_type\", \"Microsoft.ClassicCompute/virtualMachines\")){{#filter}} and {{{filter}}}{{/filter}}, extrapolation=\"last_value\", maxExtrapolations=5).mean(by=[\"azure_resource_name\"])\nCACHE_HITS = data(\"cachehits\", filter=filter(\"resource_type\", \"Microsoft.Cache/Redis\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"average\", extrapolation=\"last_value\", maxExtrapolations=5).mean(by=[\"azure_resource_name\"])\nCACHE_MISSES = data(\"cachemisses\", filter=filter(\"resource_type\", \"Microsoft.Cache/Redis\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"average\", extrapolation=\"last_value\", maxExtrapolations=5).mean(by=[\"azure_resource_name\"])\nCACHE_HIT_PERCENT=((CACHE_HITS) / ((CACHE_HITS) + CACHE_MISSES) * 100)\nINGRESS_TRAFFIC = data(\"Ingress\", filter=filter(\"resource_type\", \"Microsoft.Storage/storageAccounts\"){{#filter}} and {{{filter}}}{{/filter}}, extrapolation=\"last_value\", maxExtrapolations=2).sum(by=[\"azure_resource_name\"])\nAPP_AVG_RESPONSE_TIME = data(\"AverageResponseTime\", filter=filter(\"resource_type\", \"Microsoft.Web/sites\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"average\", extrapolation=\"null\", maxExtrapolations=-1).mean(by=[\"azure_resource_name\", \"azure_resource_group_name\", \"azure_region\"])\nEH_INCOMING_REQS = data(\"IncomingRequests\", filter=filter(\"resource_type\", \"Microsoft.EventHub/namespaces\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"sum\", extrapolation=\"null\", maxExtrapolations=-1).sum(by=[\"azure_resource_name\", \"azure_resource_group_name\", \"azure_region\"])\nLOGIC_BILLABLE_EXECS = data(\"TotalBillableExecutions\", filter=filter(\"resource_type\", \"Microsoft.Logic/workflows\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"sum\", extrapolation=\"null\", maxExtrapolations=-1).mean(by=[\"azure_resource_name\", \"azure_resource_group_name\", \"azure_region\"])\nBATCH_TASKS_COMPLETED = data(\"TaskCompleteEvent\", filter=filter(\"resource_type\", \"Microsoft.Batch/batchAccounts\"){{#filter}} and {{{filter}}}{{/filter}}, rollup=\"sum\", extrapolation=\"null\", maxExtrapolations=-1).mean(by=[\"azure_resource_name\", \"azure_resource_group_name\", \"azure_region\"])"
    },
    "groupingStructure": {
      "key": "sf_streamLabel",
      "drawBoundary": true,
      "memberSettings": []
    },
    "metrics": [
      {
        "name": "Virtual Machines",
        "varName": "VM_CPU",
        "valueLabel": "CPU %",
        "valueFormat": "Percentage",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "maxValue": 100
        }
      },
      {
        "name": "Storage Accounts",
        "varName": "INGRESS_TRAFFIC",
        "valueLabel": "Ingress",
        "valueFormat": "Bytes",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "range": [
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8856a7",
            "#810f7c"
          ]
        }
      },
      {
        "name": "App Services",
        "varName": "APP_AVG_RESPONSE_TIME",
        "valueLabel": "Avg Response Time (s)",
        "valueFormat": "Number",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "range": [
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8856a7",
            "#810f7c"
          ]
        }
      },
      {
        "name": "Batch Accounts",
        "varName": "BATCH_TASKS_COMPLETED",
        "valueLabel": "Tasks Completed",
        "valueFormat": "Number",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "range": [
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8856a7",
            "#810f7c"
          ]
        }
      },
      {
        "name": "Logic Apps",
        "varName": "LOGIC_BILLABLE_EXECS",
        "valueLabel": "Billable Executions",
        "valueFormat": "Number",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "range": [
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8856a7",
            "#810f7c"
          ]
        }
      },
      {
        "name": "Event Hubs",
        "varName": "EH_INCOMING_REQS",
        "valueLabel": "Incoming Requests",
        "valueFormat": "Number",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "quantile",
          "minValue": 0,
          "range": [
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8856a7",
            "#810f7c"
          ]
        }
      },
      {
        "name": "Redis Caches",
        "varName": "CACHE_HIT_PERCENT",
        "valueLabel": "Hit %",
        "valueFormat": "Percentage",
        "idTemplate": "azure-{{azure_resource_name}}",
        "coloring": {
          "method": "threshold",
          "limits": [
            {
              "lowerLimit": 90,
              "color": "#6bd37e"
            },
            {
              "lowerLimit": 80,
              "color": "#e2ed6a"
            },
            {
              "lowerLimit": 0,
              "color": "#ea1849"
            },
            {
              "color": "#ea1849"
            }
          ]
        }
      },
      {
        "name": "SQL Databases",
        "varName": "DTU_PERCENTAGE",
        "valueLabel": "DTU %",
        "valueFormat": "Percentage",
        "idTemplate": "azure-{{{azure_resource_name}}}",
        "coloring": {
          "method": "threshold",
          "limits": [
            {
              "lowerLimit": 80,
              "color": "#ea1849"
            },
            {
              "lowerLimit": 60,
              "color": "#eac24b"
            },
            {
              "lowerLimit": 40,
              "color": "#e2ed6a"
            },
            {
              "lowerLimit": 20,
              "color": "#acef7f"
            },
            {
              "color": "#6bd37e"
            }
          ]
        }
      }
    ]
  }
}
```