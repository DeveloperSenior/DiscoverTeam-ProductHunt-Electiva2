"use strict";

/**
 * Product Model builder object
 */
class Product {
    constructor(_id, name, description, url, tags, state, user, createdAt, updatedAt, launchAt) {
       this._id = _id;
       this.name = name;
       this.description = description;
       this.url = url;
       this.tags = tags;
       this.state = state;
       this.user = user;
       this.createdAt = createdAt;
       this.updatedAt = updatedAt;
       this.launchAt = launchAt;
    }
    static Builder = class {
        constructor() {

            this.product = new Product();

        }
        withId(_id) {
            this.product._id = _id;
            return this;
        }
        withName(name) {
            this.product.name = name;
            return this;
        }
        withDescription(description){
            this.product.description = description;
            return this;
        }
        withUrl(url) {
            this.product.url = url;
            return this;
        }
        withTags(tags){
            this.product.tags = tags;
            return this;
        }
        withState(state){
            this.product.state = state;
            return this;
        }
        withUser(user){
            this.product.user = user;
            return this;
        }
        withCreatedAt(createdAt) {

            this.product.createdAt = createdAt;

            return this;

        }
        withUpdatedAt(updatedAt) {

            this.product.updatedAt = updatedAt;

            return this;

        }
        withLaunchdAt(launchAt) {

            this.product.launchAt = launchAt;

            return this;

        }

        build() {

            return this.product;

        }
    };
}

module.exports = { Product }