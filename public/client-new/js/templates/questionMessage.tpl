<div id="{{data.question.id.id}}" class="ask-outer follow-container" name ="{{data.question.userId.id}}">

		<div class="ask-content">
              <div class="follw-left">
                  <div class="ask-img"><img  id="{{data.question.id.id}}-img" src=""></div>
                  {{#if owner}}
                  {{else}}
                  	<a href="#"  id="{{data.question.userId.id}}" class="follow-button follow-user">follow</a>
                  {{/if}}
              </div>
              <div  class="ask-info">
                <div class="ask-comment">
                  <div class="follow-names">
                    <ul class="follow-name-left">
                      <li><span>@{{data.question.firstNameofQuestionAsker}} {{data.question.lastNameofQuestionAsker}} </span> -  {{data.question.creationDate}}  - {{data.question.questionAccess.name}}</li>
                    </ul>
                    <div class="follow-right"><a href="#"  id="{{data.question.id.id}}-follow" class="follow-button follow-question">follow</a></div>
                  </div>
                  <p id="{{data.question.id.id}}-id" >{{data.question.questionBody}}</p>
                  <div id="{{data.question.id.id}}-poll-Option-area">
 
                  </div>
                  <div class="follow-bottom">
                    <ul class="follow-name-left show-all-block">
                      <li><a class="rocks-question" href="#">Rock</a></li>
                      <li  id="{{data.question.id.id}}-Answer" ><a href="#" class="add-answer"> Answer</a></li>
                      <li><a href="#" class="add-comment" > Comment</a></li>
                      <li><a class="comment-icon" href="#"></a></li>
  					 <a id=" " href="#" class="delete_msg drag-rectangle" data-original-title="Flag this"></a> 
                    </ul>
                   
                    </div>
                    <div id= "{{data.question.id.id}}-comment-ans-area" class="comment-ans" ></div>
<!--                     <div id="{{data.question.id.id}}-addComments" class="follow-comment" style="display:none;"> -->
<!-- 				    <textarea id="{{data.question.id.id}}-questionComment" class="add-question-comment add-question-comment" placeholder="Add Comments.."  onblur="this.placeholder = 'Add Comments..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows=""></textarea> -->
<!-- 				</div> -->
<!-- 				<div id="{{data.question.id.id}}-addAnswer" class="follow-comment" style="display:none;"> -->
<!--                     <textarea id="{{data.question.id.id}}-questionsAnswer" class="add-question-comment add-question-comment" placeholder="Add Answers.."  onblur="this.placeholder = 'Add Answers..'" onfocus="this.placeholder = ''" placeholder="" cols="" rows=""></textarea> -->
<!-- 				</div>	 -->
				<a id="{{data.question.id.id}}" href="#" data-original-title="Delete" class="delete_post drag-rectangle" ></a>
                </div>

                <div class="answer-info">
                  <div class="answer-conatiner">
                    <div class="button-block">
                      <ul class="follow-name-left show-all-block">
                        <li><a href="#" id="{{data.question.id.id}}-qstRockCount" class="uprocks-message rocks-question"><span>{{rocks}}</span></a></li>
                        <a class="btn grey-buttons who-rocked-it" href="#">Who Rocked It?</a> <a class="btn grey-buttons show-all-comments"  href="#"><span id="{{data.question.id.id}}-totalComment" >0</span> Comments</a> <a id="{{data.question.id.id}}-Answerbutton" class="btn grey-buttons " href="#"> <span>0</span> Answers</a>
						<a  class="btn grey-buttons  show-all" id="{{data.question.id.id}}-show-hide" href="#">Show All</a>
                      </ul>
                       
                  </div>
                  
                  <div id="{{data.question.id.id}}-allComments" class="comment-wrapper">
                  </div>
				  <div id="{{data.question.id.id}}-newCommentList" class="comment-wrapper" style="display: none;">
                  </div>
			 	  <div id="{{data.question.id.id}}-questionRockers" class="comment-wrapper" style="display: none;">
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>

          </div>