const question=await QuestionModel.create({
    title:'',
    user_id:''
})
console,log(question.id)

for(const option of req.body.option){
   const optionObject={
    question_id:question.id,
    text:option.text
} 
}

s