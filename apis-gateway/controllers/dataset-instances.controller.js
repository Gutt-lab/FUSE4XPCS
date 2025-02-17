const dbCon = require("../config/db-connections")
const mongoCon = require("../config/mongo-connections")

async function MongoAddInstance(dataset_instance_id) {
    const db = await mongoCon.EstablishConnection()
    var myobj = { dataset_instance_id: dataset_instance_id};

    const AddResult =  await db.collection("dataset_instances").insertOne(myobj, function(err, res) {
        return res;
    })
    return AddResult;
  }

// ============================== Main Functions ==============================

function GetDatasetInstancesByUserIdAndExperimentId(req,res) {
    var query = "SELECT dataset_instances_list.*, users.login_name FROM daphne_centeral.dataset_instances_list "+
    " INNER JOIN users ON users.user_id = dataset_instances_list.dataset_instance_owner_id " +
    "WHERE dataset_instance_owner_id = "+req.headers.dataset_instance_owner_id+
    " AND dataset_instance_linked_experiment_id = "+req.headers.linked_experiment_id
    try 
    {
        var con = dbCon.handleDisconnect()
        con.query(query, function (err, result) 
        {
            if (err) {
                console.log(err)
                con.end()
                return res.json(err);
            }
            if (result[0] === undefined ) {
                con.end()
                res.status(200)
                return res.json(
                    -1004
                );
            } 
            else 
            {
                con.end()
                res.status(200)
                return res.json(result)
            }

        })
    }
    catch (error) 
    {   
        con.end()
        return res.json(error);
    }
}

function GetDatasetInstanceById(req,res) {
    var query = "SELECT dataset_instances_list.*, DATE_FORMAT(dataset_instances_list.dataset_instance_added_on, '%d.%m.%Y') as 'dataset_instance_added_on',"+
    " DATE_FORMAT(dataset_instances_list.dataset_instance_last_modified_on, '%d.%m.%Y') as 'dataset_instance_last_modified_on', "+
    " experiments_list.experiment_name, users.login_name  FROM dataset_instances_list "+
    " INNER JOIN users ON users.user_id = dataset_instances_list.dataset_instance_owner_id " +
    " LEFT JOIN experiments_list ON experiments_list.experiment_id = dataset_instances_list.dataset_instance_linked_experiment_id " +
    " WHERE dataset_instance_id in(" +req.headers.object_id+")";
    try  
    {
        var con = dbCon.handleDisconnect()
        con.query(query, function (err, result) {
            if (err) {
                console.log(err)
                con.end()
                return res.json(err);
            }
            if (result[0] === undefined ) {
                con.end()
                res.status(200)
                return res.json(
                       -1004
                );
            } 
            else {
                con.end()
                res.status(200)
                return res.json(result)
            }
        })
    }
    catch (error) 
    {   
        con.end()
        return res.json(error);
    }
}


function GetDatasetInstancesByUserId(req,res) {
    var query = "SELECT dataset_instances_list.*, DATE_FORMAT(dataset_instances_list.dataset_instance_added_on, '%d.%m.%Y') as 'dataset_instance_added_on',"+
    " DATE_FORMAT(dataset_instances_list.dataset_instance_last_modified_on, '%d.%m.%Y') as 'dataset_instance_last_modified_on', "+
    " experiments_list.experiment_name,experiments_list.experiment_id, users.login_name  FROM dataset_instances_list "+
    " INNER JOIN users ON users.user_id = dataset_instances_list.dataset_instance_owner_id " +
    " LEFT JOIN experiments_list ON experiments_list.experiment_id = dataset_instances_list.dataset_instance_linked_experiment_id " +
    "WHERE dataset_instance_owner_id = "+req.headers.dataset_instance_owner_id
    try 
    {
        var con = dbCon.handleDisconnect()
        con.query(query, function (err, result) 
        {
            if (err) {
                console.log(err)
                con.end()
                return res.json(err);
            }
            if (result[0] === undefined ) {
                con.end()
                res.status(200)
                return res.json(
                    -1004
                );
            } 
            else 
            {
                con.end()
                res.status(200)
                return res.json(result)
            }

        })
    }
    catch (error) 
    {   
        con.end()
        return res.json(error);
    }
}

function CreateDatasetInstance(req,res) {
    var query = "INSERT INTO dataset_instances_list(dataset_instance_owner_id, dataset_instance_name, dataset_instance_linked_experiment_id, dataset_instance_added_on, dataset_instance_last_modified_on)"
                + " VALUES(?,?,?, now(), now())"
    var values = [req.headers.owner_id, req.body.dataset_instance_name, req.body.dataset_instance_linked_experiment_id]
    try {
        var con = dbCon.handleDisconnect()
        con.query(query, values, function (err, result) {
            if (err) throw err;
            if (result === undefined) {
                con.end()
                res.status(404)
                return res.json(
                    {
                        "error": 'No'
                    }
                );
            }
            else {
                MongoAddInstance(result.insertId)
                .then(
                    r => {
                        con.end()
                        res.status(200);
                        return res.json(result.insertId)
                    }
                )
            }
        })
    }
    catch (error) {
        con.end()
        return res.json(error);
    }
}

function UpdateExperimentById(req,res) {
    
}

function DeleteExperimentById(req,res) {
    
}

module.exports = 
{ 
    GetDatasetInstancesByUserIdAndExperimentId, 
    GetDatasetInstancesByUserId, 
    GetDatasetInstanceById,
    //SaveAttachedFile,
    CreateDatasetInstance,
    UpdateExperimentById,
    DeleteExperimentById
};