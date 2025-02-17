const dbCon = require("../config/db-connections")

function CreateExperimentLabBook(req, res) {
    //console.log(req.body.eln_data)
    const eln_doi = doi.GenerateELNDOI(req.body.eln_name, req.headers.eln_owner_id)
    //var dataELN = JSON.stringify(req.body.eln_data) 
    var query = "INSERT INTO eln_list(eln_owner_id, eln_name, eln_doi, eln_data, eln_added_on, eln_last_modified_on) VALUES(?,?,?,?, now(), now())"
    var values = [req.headers.eln_owner_id, req.body.eln_name, eln_doi, ""]
    try {
        var con = dbCon.handleDisconnect()
        //var values = [req.body.eln_owner_id, req.body.eln_name, req.body.eln_doi, eq.body.eln_data  ]
        con.query(query, values, function (err, result) {
            if (err) throw err;
            if (result === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No Datasets'
                    }
                );
            }
            else {
                con.end()
                return res.json({ "eln_doi": eln_doi })
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

function GetLabBookListByID(req, res) {
    var query = "SELECT * FROM eln_list" + " INNER JOIN users ON users.user_id = eln_list.eln_owner_id " +
        " WHERE eln_owner_id = " + "\"" + req.headers.eln_owner_id + "\"" + ";"
    try {
        var con = dbCon.handleDisconnect()
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result[0] === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No Datasets'
                    }
                );
            }
            else {
                con.end()
                return res.json(result)
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

function UpdateLabBookListByDOI(req, res) {

    var dataELN = JSON.stringify(req.body.eln_data)
    var query = "UPDATE eln_list" +
        " SET eln_data = ? , eln_name = ? , eln_last_modified_on = now() WHERE eln_doi = ?;"
    var values = [dataELN, req.body.eln_name, req.body.eln_doi]
    try {
        var con = dbCon.handleDisconnect()
        //var values = [req.body.eln_owner_id, req.body.eln_name, req.body.eln_doi, eq.body.eln_data  ]
        con.query(query, values, function (err, result) {
            if (err) {
                con.end()
                return res.json(err)
            }
            if (result === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No Datasets'
                    }
                );
            }
            else {
                con.end()
                return res.json(result)
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

function UpdateLabBookListTitleByDOI(req, res) {
    var query = "UPDATE eln_list" +
        " SET eln_name = ? , eln_last_modified_on = now() WHERE eln_doi = ?;"
    var values = [req.body.eln_name, req.body.eln_doi]
    try {
        var con = dbCon.handleDisconnect()
        //var values = [req.body.eln_owner_id, req.body.eln_name, req.body.eln_doi, eq.body.eln_data  ]
        con.query(query, values, function (err, result) {
            if (err) {
                con.end()
                return res.json(err)
            }
            if (result === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No Datasets'
                    }
                );
            }
            else {
                con.end()
                return res.json(result)
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

function GetLabBookLinkedDatasetsById(req, res) {
    var query = "SELECT * FROM dataset_elns_links" +
        " WHERE eln_id = " + req.headers.eln_id + ";"
    try {
        var con = dbCon.handleDisconnect()
        //var values = [req.body.eln_owner_id, req.body.eln_name, req.body.eln_doi, eq.body.eln_data  ]
        con.query(query, function (err, result) {
            if (err) {
                con.end()
                return res.json(err)
            }
            if (result === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No Datasets'
                    }
                );
            }
            else {
                con.end()
                return res.json(result)
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

module.exports =
{
    CreateExperimentLabBook,
    GetLabBookListByID,
    UpdateLabBookListByDOI,
    UpdateLabBookListTitleByDOI,
    GetLabBookLinkedDatasetsById
}