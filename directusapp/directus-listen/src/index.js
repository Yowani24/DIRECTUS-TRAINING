import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 10);

export default ({ filter, action }) => {
  filter("items.create", async (input, schema) => {
    input["nano_id"] = await nanoid();
  });

  action("items.update", async (input, schema) => {
    await updatingProjectsStatus(input, schema);
    await updatingSafrasStatus(input, schema);
  });
};

async function updatingSafrasStatus(input, schema) {
  const knex = schema.database;
  const project_id = input.payload.project_id;

  await knex("safras").whereNull("project_id").update({
    status: "draft",
  });

  await knex("safras").whereNotNull("project_id").update({
    status: "published",
  });
}

async function updatingProjectsStatus(input, schema) {
  const knex = schema.database;
  const project_id = input.payload.project_id;



  if(project_id){
    await knex("projects").where("id", project_id).update({
      status: "published",
      vintage_referencial: 1
    });
  }else{
    await knex("projects").where("vintage_referencial", 0).update({
      status: "draft",
    });
  }
  }


  // if (await knex("safras").whereNotNull("project_id") !== null) {
  //   await knex("projects")whereNull("project_id").update({
  //     status: "draft",
  //   });
  // }

  // await knex("projects").where("id", project_id).update({
  //   status: "published",
  // });
// }
