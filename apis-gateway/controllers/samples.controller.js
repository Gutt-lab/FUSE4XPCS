const dbCon = require("../config/db-connections")
const mongoCon = require("../config/mongo-connections")
const authen = require('../config/authorization')


async function MongoAddSample(sample_id, sample_doi) {
    const db = await mongoCon.EstablishConnection()
    var myobj = { sample_id: sample_id, sample_doi:sample_doi};

    const AddResult =  await db.collection("samples").insertOne(myobj, function(err, res) {
        return res;
    })
    return AddResult;
  }


// ============================== Main Functions ==============================

function GetSamplesByUserId(req,res) {
    var query = "SELECT samples_list.*,  DATE_FORMAT(samples_list.sample_added_on, '%d.%m.%Y') as 'sample_added_on' , users.login_name, GROUP_CONCAT(DISTINCT link_experiment_id,'**n**',link_experiment_name SEPARATOR '-*-NN-*-') as linked_experiments FROM samples_list "+
    " INNER JOIN users ON users.user_id = samples_list.sample_owner_id " +
    "LEFT JOIN link_experiments_samples ON link_experiments_samples.link_sample_id = samples_list.sample_id "+
    "WHERE sample_owner_id = "+req.headers.sample_owner_id + " group by sample_id"
                
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
                    { 
                        "error": 'No Samples found'  
                    }
                );
            } 
            else { 
                for (let index = 0; index < result.length; index++) 
                {
                    if (result[index].linked_experiments ===null) continue;
                    result[index].linked_experiments_names = []
                    result[index].linked_experiments_ids = []
                    var le = result[index].linked_experiments.split("-*-NN-*-")
                    for (let str_index = 0; str_index < le.length; str_index++) 
                    {
                        const element = le[str_index];
                        var e = element.split("**n**")
                        result[index].linked_experiments_ids.push(e[0]) 
                    
                        result[index].linked_experiments_names.push(e[1])
                    }
                }
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

function GetSamplesByUserIdAndExperimentId(req,res) {
    var query = "SELECT samples_list.*,DATE_FORMAT(samples_list.sample_added_on, '%d.%m.%Y') as 'sample_added_on' , users.login_name FROM samples_list "+
    " INNER JOIN users ON users.user_id = samples_list.sample_owner_id " +
    "WHERE sample_owner_id = "+req.headers.sample_owner_id+
    " AND sample_linked_experiment_id = "+req.headers.linked_experiment_id
                
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
                    { 
                        "error": 'No Samples found'  
                    }
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

function CreatTest(req) {
    console.log(req.body);
    
}

function CreateSample(req,res) {
    var query = "INSERT INTO samples_list(sample_owner_id, sample_name, sample_doi, sample_added_on)"
                + " VALUES(?,?,?, now())"

    var query_links = ""
    if(req.body.link){
         query_links = "INSERT INTO link_experiments_samples (link_experiment_id, link_sample_id, link_experiment_name, link_sample_name)" +
        " SELECT ? AS link_experiment_id, ? AS link_sample_id, experiment_name AS link_experiment_name, ? AS link_sample_name" +
        " FROM daphne_centeral.experiments_list WHERE experiment_id = ?"  
    }


    sampleDoi = authen.GenerateRandomDOI(req.body.sample_name) 
    var values = [req.headers.owner_id, req.body.sample_name, sampleDoi]
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
                MongoAddSample(result.insertId, sampleDoi)
                .then(
                    r => {
                        if (req.body.link) {
                            var values_links = [req.body.link, Number(result.insertId), req.body.sample_name,Number(req.body.link)]
                            con.query(query_links, values_links, function (err, result_l){
                                if (err) console.log( err);
                                con.end()
                                res.status(200);
                                return res.json(result.insertId)
                            })
                        } else {
                            con.end()
                            res.status(200);
                            return res.json(result.insertId)
                        }

   
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

function GetSampleById(req,res) {
    if(!req.headers.object_id || req.headers.object_id.length<1)  return res.json([])
    var query = "SELECT samples_list.*, DATE_FORMAT(samples_list.sample_added_on, '%d.%m.%Y') as 'sample_added_on' , GROUP_CONCAT(DISTINCT link_experiment_id,'**n**',link_experiment_name SEPARATOR '-*-NN-*-') as linked_experiments FROM daphne_centeral.samples_list "+
    " INNER JOIN users ON users.user_id = samples_list.sample_owner_id " +
    "LEFT JOIN daphne_centeral.link_experiments_samples ON link_experiments_samples.link_sample_id = samples_list.sample_id "+
    "WHERE sample_id in ("+req.headers.object_id+") group by sample_id"

    try 
    {
        var con = dbCon.handleDisconnect()
        con.query(query,  function (err, result) {
            if (err) {
                console.log(err)
                con.end()
                return res.json(err);
            }
            if (result[0] === undefined ) {
                con.end()
                res.status(200)
                return res.json(-1004);
            } 
            else { 

                for (let index = 0; index < result.length; index++) 
                {
                    if (result[index].linked_experiments ===null) continue;
                    result[index].linked_exps_names = []
                    result[index].linked_exps_ids = []
                    var ls = result[index].linked_experiments.split("-*-NN-*-")
                    for (let str_index = 0; str_index < ls.length; str_index++) 
                    {
                        const element = ls[str_index];
                        var s = element.split("**n**")
                        result[index].linked_exps_ids.push(s[0]) 
                    
                        result[index].linked_exps_names.push(s[1])
                    }
                    
                }
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


function UpdateSampleById(req,res) {
    
}

function DeleteSampleById(req,res) {
    
}

module.exports = 
{ 
    GetSamplesByUserId, 
    GetSamplesByUserIdAndExperimentId,
    GetSampleById,
    CreateSample,
    UpdateSampleById,
    DeleteSampleById, 
    CreatTest
};