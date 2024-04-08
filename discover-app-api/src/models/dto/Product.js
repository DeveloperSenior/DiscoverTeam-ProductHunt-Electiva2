"use strict";

class LinkProduct {

    constructor(link, socialMediaLink) {
        this.link = link;
        this.socialMediaLink = socialMediaLink;
    }

}

class CategoryProduct {

    constructor(category, subCategory) {
        this.category = category;
        this.subCategory = subCategory;
    }

}

class InfoProduct {

    constructor(name, tags, links, description, categories, isOpenSource) {
        this.name = name;
        this.isOpenSource = isOpenSource
        this.tags = tags;
        this.links = links;
        this.description = description;
        this.categories = categories;
    }

}

class ImageMediaProduct {

    constructor(linksImages, linkDemo, linkVideo) {
        this.linksImages = linksImages;
        this.linkDemo = linkDemo;
        this.linkVideo = linkVideo;
    }

}

class PromoCodeProduct {

    constructor(description, code, expirationDate) {
        this.description = description;
        this.code = code;
        this.expirationDate = expirationDate;
    }

}

class ExtrasProduct {
    constructor(pricing, promoCode, fundingInfo, firstComment) {
        this.pricing = pricing;
        this.promoCode = promoCode;
        this.fundingInfo = fundingInfo;
        this.firstComment = firstComment;

    }

}

/**
 * Product Model builder object
 */
class Product {
    constructor(_id, owner, info, imagesMedia, makers, shoutouts, extras) {
        this._id = _id;
        this.owner = owner;
        this.userCreate = null;
        this.creationDate = null;
        this.userUpdate = null;
        this.launchDate = null;
        this.info = info;
        this.imagesMedia = imagesMedia;
        this.makers = makers;
        this.shoutouts = shoutouts;
        this.extras = extras;
    }
    static Builder = class {
        constructor() {

            this.product = new Product();

        }
        withId(_id) {
            this.product._id = _id;
            return this;
        }
        withUserCreate(userCreate) {
            this.product.userCreate = userCreate;
            return this;
        }
        withCreationDate(creationDate){
            this.product.creationDate = creationDate;
            return this;
        }
        withUserUpdate(userUpdate) {
            this.product.userUpdate = userUpdate;
            return this;
        }
        withLaunchDate(launchDate){
            this.product.launchDate = launchDate;
            return this;
        }
        withOwner(owner) {

            this.product.owner = owner;

            return this;

        }
        withInfo(info) {

            this.product.info = info;

            return this;

        }
        withImagesMedia(imagesMedia) {

            this.product.imagesMedia = imagesMedia;

            return this;

        }
        withMakers(makers) {

            this.product.makers = makers;

            return this;

        }
        withShoutouts(shoutouts) {

            this.product.shoutouts = shoutouts;

            return this;

        }
        withExtras(extras) {

            this.product.extras = extras;

            return this;

        }

        build() {

            return this.product;

        }
    };
}

module.exports = { Product, InfoProduct, CategoryProduct, LinkProduct, ImageMediaProduct, PromoCodeProduct, ExtrasProduct }