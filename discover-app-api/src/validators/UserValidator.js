const Schema = require("fluent-json-schema");
const Ajv = require("ajv")

const ajv = new Ajv({ allErrors: true });

const userSchema =
Schema.object()
        .prop("name", Schema.string().raw({ nullable : true }))
        .prop("nickName", Schema.string().raw({ nullable : true }))
        .prop("email", Schema.string().required().raw({ nullable: false }))
        .prop("accessToken", Schema.string().required().raw({ nullable: false })).valueOf();

const validateSchema = ajv.compile(userSchema);
validateErrors = (errors) => errors.map(error =>  error.message );

const validateUser = (body) => {
    return { isValid: validateSchema(body), errors: validateErrors(validateSchema.errors || []) }
}

module.exports = { validateUser }