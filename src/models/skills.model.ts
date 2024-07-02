import { logger } from "../logger";
import { db } from "../db";

export function selectSkills() {
  logger.debug(`In selectListings() in listings.model`);

  let queryStr = "SELECT skills.skill_name FROM skills";

  return db.query(queryStr).then(({ rows }) => {
    console.log(rows);

    if (!rows) {
      return Promise.reject({ status: 404, msg: "No skills found!" });
    }

    const skillsArr = rows.map((skill) => skill.skill_name);

    return { skills: skillsArr };
  });
}
