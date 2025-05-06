const fs = require("fs");
const readline = require("readline");
const path = require("path");
require("dotenv").config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Routing
const createRouteFile = (crudName, folderPath) => {
  const endpointName = crudName.replace(/^./, (match) => match.toUpperCase());
  const routeContent = `
const router = require("express").Router();
const ${crudName}Controller = require('./${crudName}.controller');

// Create Operation - Create ${crudName}
router.post('/create${endpointName}', ${crudName}Controller.create${endpointName});

// Read Operation - Get all ${crudName}
router.get('/getAll${endpointName}', ${crudName}Controller.getAll${endpointName});

// Read Operation - Get all ${crudName} by Id 
router.get("/getAll${endpointName}ById/:id", ${crudName}Controller.getAll${endpointName}ById);

// Read Operation - Get a single ${crudName} by Id
router.get('/get${endpointName}ById/:id', ${crudName}Controller.get${endpointName}ById);

// Update Operation - Update ${crudName}
router.put('/update${endpointName}/:id', ${crudName}Controller.update${endpointName});

// Delete Operation - Delete ${crudName}
router.delete('/delete${endpointName}/:id', ${crudName}Controller.delete${endpointName});

module.exports = router;
`;

  fs.writeFileSync(
    path.join(folderPath, `${crudName}.router.js`),
    routeContent
  );
};

// Model
const createModelFile = (crudName, fields, foreignKey, folderPath) => {
  const schemaFields = fields
    .map((field) => {
      if (field === foreignKey) {
        // If the field is the foreign key, set the type to mongoose.Schema.Types.ObjectId
        return `  ${field}: { type: mongoose.Schema.Types.ObjectId, ref: "AddYourRefSchemaNameHere", required: false },`;
      } else {
        return `  ${field}: { type: String, required: false },`;
      }
    })
    .join("\n");

  const modelContent = `
const mongoose = require('mongoose');

const ${crudName}Schema = new mongoose.Schema({
${schemaFields}
}, { timestamps: true });

module.exports = mongoose.model('${crudName}', ${crudName}Schema);
`;

  fs.writeFileSync(path.join(folderPath, `${crudName}.model.js`), modelContent);
};

// Controller
const createControllerFile = (crudName, folderPath) => {
  const endpointName = crudName.replace(/^./, (match) => match.toUpperCase());

  const controllerContent = `
const ${crudName}Model = require('./${crudName}.model');

  // Create Operation - Create ${crudName}
  const create${endpointName} = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    const ${crudName} = new ${crudName}Model(req.body);
    ${crudName}
      .save()
      .then((data) => {
        res.status(200).send({
          data: data,
          dataCount: data.length,
          message: "${crudName} created successfully!",
          success: true,
          statusCode: 200,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the ${crudName}.",
        });
      });
  };

  // Read Operation - Get all ${crudName}
  const getAll${endpointName} = (req, res) => {
    ${crudName}Model.find()
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "${crudName} fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "${crudName} not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the ${crudName}.",
        });
      });
  };

  // Read Operation - Get all ${crudName} by Id 
  const getAll${endpointName}ById  = (req, res) => {
    const id = req.params.id;
    const condition = { _id: id};

    ${crudName}Model.find(condition)
      .then((data) => {
        if (data.length > 0) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "${crudName} fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: [],
            dataCount: data.length,
            message: "${crudName} not found!",
            success: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the ${crudName}.",
        });
      });
  };

  // Read Operation - Get a single ${crudName} by Id
  const get${endpointName}ById = (req, res) => {
    const id = req.params.id;
    ${crudName}Model.findById(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            data: data,
            dataCount: data.length,
            message: "${crudName} fetch successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(200).send({
            data: {},
            dataCount: 0,
            message: '${crudName} not found with ID=' + id,
            status: false,
            statusCode: 200,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while Retrieve the ${crudName}.",
        });
      });
  };

  // Update Operation - Update ${crudName}
 const update${endpointName} = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  ${crudName}Model.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (data) {
        res.status(200).send({
          message: "${crudName} was updated successfully.",
          success: true,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          message: 'Cannot update ${crudName} with order ID=' + id + '. Maybe ${crudName} was not found!',
          success: false,
          statusCode: 404,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating ${crudName} with ID=" + id,
      });
    });
};


// Delete Operation - Delete ${crudName}
  const delete${endpointName} = (req, res) => {
    const id = req.params.id;
  
    ${crudName}Model.findByIdAndDelete(id)
      .then((data) => {
        if (data) {
          res.status(200).send({
            message: "${crudName} was deleted successfully!",
            success: true,
            statusCode: 200,
          });
        } else {
          res.status(404).send({
            message: 'Cannot delete ${crudName} with ID=' + id + '. Maybe ${crudName} was not found!',
            success: false,
            statusCode: 404,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      });
  };

module.exports = {
  create${endpointName},
  getAll${endpointName},
  getAll${endpointName}ById,
  get${endpointName}ById,
  update${endpointName},
  delete${endpointName}
};
`;

  fs.writeFileSync(
    path.join(folderPath, `${crudName}.controller.js`),
    controllerContent
  );
};

// Generator
const generateCRUDFiles = (crudName, fields, foreignKey) => {
  const appFolderPath = path.join(
    __dirname,
    "src",
    "app",
    process.env.PROJ_NAME
  );
  const folderPath = path.join(appFolderPath, crudName);

  // Check if the folder exists, and create it if it doesn't.
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  createControllerFile(crudName, folderPath);
  createModelFile(crudName, fields, foreignKey, folderPath);
  createRouteFile(crudName, folderPath);
  updateRouterRegistry(crudName, process.env.PROJ_NAME);

  console.log(`CRUD for "${crudName}" generated successfully.`);
  rl.close();
};

// Prompt
const askForeign = (crudName, fields) => {
  rl.question("Do you want to make any of the above key as foreign? (y/n): ", (answer) => {
    if (answer.toLowerCase() === "y") {
      rl.question("Enter the name of the foreign key field: ", (foreignKey) => {
        // Remove special symbols and spaces from foreignKey
        // foreignKey = foreignKey.replace(/[^\w]/g, "");

        // Convert foreignKey to camelCase if it contains spaces
        foreignKey = convertToCamelCase(foreignKey);

        // Check if the foreign key exists in the fields array
        if (!fields.includes(foreignKey)) {
          console.error("Foreign key field not found in the provided fields.");
          rl.close();
          return;
        }

        generateCRUDFiles(crudName, fields, foreignKey);
        rl.close(); // Close readline interface after processing
      });
    } else {
      // If the user does not want a foreign key, pass null as the foreignKey argument
      generateCRUDFiles(crudName, fields, null);
      rl.close(); // Close readline interface after processing
    }
  });
};

// Prompt
rl.question("Enter the CRUD name (ex. carDemo): ", (crudName) => {
  rl.question("Enter fields (comma-separated): ", (fieldsInput) => {
    // Remove special symbols and spaces from crudName
    // crudName = crudName.replace(/[^\w]/g, "");

    // Convert crudName to title case
    crudName = convertToCamelCase(crudName);

    // Convert fieldsInput to camelCase if it contains spaces
    const fields = fieldsInput
      .split(",")
      .map((field) => convertToCamelCase(field))
      .filter((field) => field !== ""); // Filter out empty fields

    if (fields.length === 0) {
      console.error("No fields entered. Please provide at least one field.");
      rl.close();
      return;
    }

    askForeign(crudName, fields);
  });
});

// Helper function to convert string to camelCase
const convertToCamelCase = (str) => {
  // return str.replace(/\s+(.)/g, (match, char) => char.toUpperCase());
  // return str.toLowerCase().replace(/\s+(.)/g, (_, match) => match.toUpperCase());
  // return str.replace(/\s+(.)/g, (_, match) => match.toUpperCase());
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, match) => match.toUpperCase());
};

const updateRouterRegistry = (newCRUDName, functionalName) => {
  // Construct the path to routeRegistry.js
  const routeRegistryPath = path.join(
    __dirname,
    "src",
    "config",
    "routeRegistry.js"
  );

  // Construct the new route string to be added
  const newRoute = `app.use("/${newCRUDName}", require("../app/${process.env.PROJ_NAME}/${newCRUDName}/${newCRUDName}.router"));`;

  // Read the current content of routeRegistry.js
  fs.readFile(routeRegistryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading routeRegistry.js:", err);
      return;
    }

    // Check if the functionalName already exists in the file
    const functionExists = data.includes(
      `const ${functionalName} = (app) => {`
    );

    if (!functionExists) {
      // If the function does not exist, create it
      const newFunction = `const ${functionalName} = (app) => {\n  // Add your middleware here if needed\n};\n\n`;
      const updatedData = newFunction + data;

      // Write the updated data back to routeRegistry.js
      fs.writeFile(routeRegistryPath, updatedData, "utf8", (err) => {
        if (err) {
          console.error("Error writing routeRegistry.js:", err);
        } else {
          console.log(
            `Function "${functionalName}" added to routeRegistry.js successfully.`
          );
          addRouteToFunction(
            newCRUDName,
            routeRegistryPath,
            functionalName,
            newRoute,
            "newProj"
          );
        }
      });
    } else {
      // If the function exists, add the new route directly
      addRouteToFunction(
        newCRUDName,
        routeRegistryPath,
        functionalName,
        newRoute,
        "existingProj"
      );
    }
  });
};

const addRouteToFunction = (
  newCRUDName,
  routeRegistryPath,
  functionalName,
  newRoute,
  operation
) => {
  // Find the position where the new route should be inserted
  fs.readFile(routeRegistryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading routeRegistry.js:", err);
      return;
    }

    const startIndex = data.indexOf(`const ${functionalName} = (app) => {`);
    if (startIndex === -1) {
      console.error(
        `Function "${functionalName}" not found in routeRegistry.js.`
      );
      return;
    }

    // Find the closing parenthesis of the functional block
    const endIndex = data.indexOf("};", startIndex);
    if (endIndex === -1) {
      console.error(
        `Missing closing brace for "${functionalName}" function in routeRegistry.js.`
      );
      return;
    }

    // Insert the new route into the functional block
    const updatedData =
      data.slice(0, endIndex) + `  ${newRoute}\n` + data.slice(endIndex);

    // Write the updated data back to routeRegistry.js
    fs.writeFile(routeRegistryPath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing routeRegistry.js:", err);
      } else {
        console.log(
          `Route for "${newCRUDName}" added to routeRegistry.js inside "${functionalName}" successfully.`
        );
        if (operation == "newProj") {
          // Update the routes object with the new function
          updateRoutesObject(functionalName, routeRegistryPath);
        }
      }
    });
  });
};

const updateRoutesObject = (functionalName, routeRegistryPath) => {
  fs.readFile(routeRegistryPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading routeRegistry.js:", err);
      return;
    }

    // Find the position of const routes = {
    const routesStartIndex = data.indexOf("const routes = {");
    if (routesStartIndex === -1) {
      console.error("Unable to find 'const routes = {' in routeRegistry.js.");
      return;
    }

    // Find the closing brace } of the routes object
    const routesEndIndex = data.indexOf("};", routesStartIndex);
    if (routesEndIndex === -1) {
      console.error(
        "Missing closing brace for 'routes' object in routeRegistry.js."
      );
      return;
    }

    // Construct the new entry to add to the routes object
    const newEntry = `\n    ${functionalName},`;

    // Insert the new entry into the routes object right after "Plugins"
    const updatedData =
      data.slice(0, routesStartIndex + "const routes = {".length) +
      `${newEntry}` +
      data.slice(routesStartIndex + "const routes = {".length);

    // Write the updated data back to routeRegistry.js
    fs.writeFile(routeRegistryPath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing routeRegistry.js:", err);
      } else {
        console.log(
          `Function "${functionalName}" added to the routes object successfully.`
        );
      }
    });
  });
};
