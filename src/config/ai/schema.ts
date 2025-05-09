import { Schema } from "firebase/vertexai";



export const FEATURE_SCHEMA = Schema.object({
    properties: {
        feature: Schema.string({
            description: "The name of the feature must be identical to the one in the <DATA>",
        }),
        description: Schema.string({
            description: "The description of the feature",
        }),
        amount: Schema.string({
            description: "The amount of the feature. if not set put (contact admin)",
        }),
        duration: Schema.string({
            description: "The duration of the feature. if not set put (contact admin)",
        }),
        category: Schema.string({
            description: "The category of the feature",
        }),
        pages: Schema.number({
            description: "The number of pages for the feature. if not set put (contact admin)",
        }),
    },
});

export const GROUP_FEATURE_SCHEMA = Schema.object({
    description: "List of categories or category features included in the project",
    properties: {
        category: Schema.string({
            description: "Category or Common category of features included in the project",
        }),
        items: Schema.array({
            description: "List of one or more features that belong to the common category",
            items: FEATURE_SCHEMA,
        }),
    },
});


export const INVOICE_SCHEMA = Schema.object({
    properties: {
        project: Schema.string({
            description: "The name of the project",
        }),
        invoiceGroup:
            Schema.array({
                description: "List of features included in the project",
                items: GROUP_FEATURE_SCHEMA,
            }),

        total: Schema.object({
            properties: {
                amount: Schema.number({
                    description: "The total amount of the project",
                }),
                duration: Schema.number({
                    description: "The total duration of the project",
                }),
                pages: Schema.number({
                    description: "The total pages of the project",
                }),
            },
        }),
    },

});


export const FILE_FEATURE_SCHEMA = Schema.object({
    properties: {
        feature: Schema.string({
            description: "The name of the feature",
        }),
        description: Schema.string({
            description: "The description of the feature",
        }),
        category: Schema.string({
            description: "The category of the feature",
        }),
    },
});

export const GROUP_FILE_FEATURE_SCHEMA =
    Schema.array({
        description: "List of one or more features that belong to the common category",
        items: FILE_FEATURE_SCHEMA,
    })

export const FILE_EXTRACTION_SCHEMA = Schema.object({
    properties: {

        features: Schema.array({
            description: "List of identified features extracted from the file",
            items: GROUP_FILE_FEATURE_SCHEMA,
        }),

        missing_features: Schema.array({
            description: "List of suggested additional features that could enhance the web application",
            items: GROUP_FILE_FEATURE_SCHEMA,
        }),
    },

});

