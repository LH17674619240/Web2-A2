var dbcon = require("../crowdfunding_db");
var connection = dbcon.getconnection();
connection.connect();
var express = require('express');
var router = express.Router();

//Get all active fundraisers
router.get("/AllFundraisers", (req, res) => {
    const query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;
    connection.query(query, (err, records) => {
        if (err) {
            console.error("Retrieval failed with an error:", err);
            res.send("Server Error");
        } else {
            res.json(records);
        }
    });
});

//Get all categories
router.get("/AllCategories", (req, res) => {
    const query = 'SELECT * FROM CATEGORY';
    connection.query(query, (err, records) => {
        if (err) {
            console.error("Retrieval failed with an error:", err);
            res.send("Server Error");
        } else {
            res.json(records);
        }
    });
});

// Retrieve all active fundraisers based on the conditions
router.get("/search", (req, res) => {
    const { ORGANIZER, CITY, ACTIVE, CATEGORY_ID } = req.query; 
    let query = `
        SELECT f.*, c.NAME AS CATEGORY_NAME 
        FROM FUNDRAISER f 
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID 
        WHERE f.ACTIVE = TRUE
    `;

    const conditions = [];
    const params = [];
    
    if (ORGANIZER) {
        conditions.push(`f.ORGANIZER = ?`); 
        params.push(ORGANIZER);
    }
    if (CITY) {
        conditions.push(`f.CITY = ?`);
        params.push(CITY);
    }

    if (ACTIVE) {
        conditions.push(`f.ACTIVE = ?`);
        params.push(ACTIVE === 'true' ? true : false);
    }

    if (CATEGORY_ID) {
        conditions.push(`f.CATEGORY_ID = ?`);
        params.push(CATEGORY_ID);
    }
    
    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    connection.query(query, params, (err, records) => {
        if (err) {
            console.error("Error while retrieving search results:", err);
            res.send("Server Error");
        } else {
            res.json(records);
        }
    });
});



//Get detailed information of fundraiser based on ID
router.get("/FoundFundraiser/:id", (req, res) => {
    const fundraiserId = req.params.id;
    connection.query(
     "SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?", [fundraiserId],
     (err, records, fields) => {
     if (err) {
       console.error("Error getting information", err);
       res.send("Error getting fundraiser information");
     } else if (records.length === 0) {
       res.send("Fundraiser not found");
     } else {
       res.send(records);
        }
      }
    );
});

module.exports = router;