const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("motionless-crab-hoseCyclicDB")

const evaluations = db.collection("evaluations")

export const setEvaluation = async() => {
  // FIXME: "test"はevaluation IDで、UUIDになる想定。
  const testEvaluation = await evaluations.set("test_evaluation1", {
    user_id: 'test1',
    evaluated_by_name: '評価者',
    evaluated_by_relationship: '友人',
    comment: 'コメントです',
    is_published: false,
    is_deleted: false
  })
  console.log('set', testEvaluation)
}

export const getEvaluation = async() => {
  const testEvaluation = await evaluations.get("test_evaluation1")
  console.log('get', testEvaluation)
}

export const getEvaluationsByUser = async() => {
  const evaluationsByUser = await evaluations.filter({user_id: 'test1', is_deleted: false})
  console.log('getEvaluationsByUser', evaluationsByUser)
}


