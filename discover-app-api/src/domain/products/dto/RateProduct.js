"use strict";

class RateProduct {

    constructor(_id, product, user, rate, comment, createdAt, updatedAt) {

        this._id = _id;
        this.product = product;
        this.user = user;
        this.rate = rate;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

    }

    static Builder = class {

        constructor() {

            this.rateProduct = new RateProduct();

        }
        withId(_id) {

            this.rateProduct._id = _id;
            return this;

        }
        withProduct(product) {

            this.rateProduct.product = product;
            return this;

        }
        withUser(user) {

            this.rateProduct.user = user;
            return this;

        }
        withRate(rate) {

            this.rateProduct.rate = rate;
            return this;

        }
        withComment(comment) {

            this.rateProduct.comment = comment;
            return this;

        }
        withCreatedAt(createdAt) {

            this.rateProduct.createdAt = createdAt;
            return this;

        }
        withUpdatedAt(updatedAt) {

            this.rateProduct.updatedAt = updatedAt;
            return this;

        }
        build() {

            return this.rateProduct;

        }
    }
}

module.exports = { RateProduct }