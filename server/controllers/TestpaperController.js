import TestpaperModel from "../models/TestpaperModel.js";
import AnswerModel from "../models/AnswerModel.js";

import { GeminiScorer } from "../utils/AIScorer.js";
import StudentModel from "../models/StudentModel.js";

export const addTestpaper = async (req, res)=>{
    try { 
        const testpaper = await TestpaperModel.create(req.body);
        res.json(testpaper)
    } catch (error) {
        console.log(error)
    }
}

export const getAllTestPaper = async (req, res)=>{
    try {
        const testpaper = await TestpaperModel.find({

        })
        res.json(testpaper)
        
    } catch (error) {
        console.log(error)
    }
}


export const scoreTestpaper = async(req, res)=>{
    try {
        const testpaperId = req.params.testpaperId;
        const testpaper = await TestpaperModel.findOne({
            testpaperId: testpaperId
        });
        const questions = testpaper.questions;
        const uniqueStudents = await AnswerModel.distinct("studentId", { testpaperId: testpaperId });
        const answers = await AnswerModel.find({})

        console.log(uniqueStudents)

        let allScores = [];
        for( const studentId of uniqueStudents) {
            let student= await StudentModel.findOne({_id: studentId});
            let score = await scoreForStudent(studentId, testpaper);
            score.studentId= studentId;
            score.name= student.name;
            allScores.push(score)
        };
        res.json(allScores);        

    } catch (error) {
        console.log(error)
    }
}

const findUniqueStudents = async(testpaperId)=>{
    try {

        const uniqueStudents = await AnswerModel.distinct("studentId", { testpaperId: testpaperId });
        return uniqueStudents;

    } catch (error) {
        console.log(error)
    }
}

const scoreForStudent = async(studentId, testpaper)=>{
    try {
        const answers = await AnswerModel.find({ studentId: studentId, testpaperId: testpaper.testpaperId });
        let scoringResults = [];
        let totalScore =0;
        let scoredAnswer = {};
        console.log(testpaper)
        for (let answerObject of answers){
            let answer = answerObject.answer;
            let questionId= answerObject.questionId;
            
            let question = testpaper.questions[`${questionId}`];
            // console.log(testpaper.questions) 
            // console.log(question)
            let scoreObject = await GeminiScorer(question, answer);
            // console.log(scoreObject)
            scoredAnswer.testpaperId= testpaper.testpaperId;
            scoredAnswer.questionId= questionId;
            scoredAnswer.question= question;
            scoredAnswer.answer= answer;
            scoredAnswer.score = 1;
            scoredAnswer.why = scoreObject.why;

            // console.log(scoredAnswer)
            totalScore += scoreObject.score;
            scoringResults.push(scoredAnswer);
        }

        return {totalScore, scoringResults};
    } catch (error) {
        console.log(error)
    }
}

