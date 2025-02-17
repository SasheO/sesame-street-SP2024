const request = require("supertest");
const express = require("express");
const functions = require("firebase-functions/v1");

// Import your app (assuming it's exported in a file like app.js)
const app = require("../functions/index.js"); // Adjust path based on your file structure

describe("API Endpoints", () => {
    test("GET /embedded_google_search should return 200 status", async () => {
        const response = await request(app).get("/embedded_google_search");
        expect(response.status).toBe(200);
    }, 20000);

    test("GET /embedded_google_maps should return 200 status", async () => {
        const response = await request(app).get("/embedded_google_maps");
        expect(response.status).toBe(200);
    }, 20000);

    test("GET /embedded_google_search should return JSON response", async () => {
        const response = await request(app).get("/embedded_google_search");
        expect(response.headers["content-type"]).toMatch(/json/);
    }, 20000);

    test("GET /embedded_google_maps should return JSON response", async () => {
        const response = await request(app).get("/embedded_google_maps");
        expect(response.headers["content-type"]).toMatch(/json/);
    }, 20000);
});
