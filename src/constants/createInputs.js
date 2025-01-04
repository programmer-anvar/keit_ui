export const EnumInputs = [
    {
        name: 'typeName',
        label: 'Type Name',
        allowClear: true,
        hasFeedback: true,
        validateFirst: true,
        rules: [
            { required: true, message: 'Please input the Type Name!' },
            { min: 3, message: 'Name must be at least 3 characters!' },
            { max: 30, message: 'Name cannot exceed 30 characters!' },
            {
                pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                message: 'Type Name must start with a letter and can only include letters, numbers, and underscores!',
            },
        ],
        type: 'STRING',   
    },
    // {
    //     name: 'listName',
    //     label: 'List Name',
    //     allowClear: true,
    //     hasFeedback: true,
    //     validateFirst: true,
        // rules: [
        //     { required: true, message: 'Please input the List Name!' },
        //     { min: 3, message: 'Name must be at least 3 characters!' },
        //     { max: 30, message: 'Name cannot exceed 30 characters!' },
        //     {
        //         pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
        //         message: 'List Name must start with a letter and can only include letters, numbers, and underscores!',
        //     },
        // ],
    //     type: 'STRING',
    // },
]