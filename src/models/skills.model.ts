import { logger } from "../logger";
import { db } from "../db";

export function selectSkills() {
  logger.debug(`In selectSkills() in skills.model`);

  let queryStr = "SELECT skills.skill_name FROM skills";

  return db.query(queryStr).then(({ rows }) => {
    if (!rows) {
      return Promise.reject({ status: 404, msg: "No skills found!" });
    }

    const skillsArr = rows.map((skill) => skill.skill_name);

    return { skills: skillsArr };
  });
}

export function selectSkillsByListId(listId: number) {
  logger.debug(`In selectSkillsByListId() in skills.model`);

  let queryStr = `SELECT list_skill_junc.skill_id, skills.skill_name
    FROM list_skill_junc 
    JOIN skills ON list_skill_junc.skill_id = skills.skill_id
    WHERE list_skill_junc.list_id = $1;`;

  return db.query(queryStr, [listId]).then(({ rows }) => {
    return rows;
  });
}
