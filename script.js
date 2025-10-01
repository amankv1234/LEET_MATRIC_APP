
document.addEventListener("DOMContentLoaded", function() {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const totalProgressCircle = document.querySelector(".total-progress");
    const totalLabel = document.getElementById("total-label");

    const cardStatsContainer = document.querySelector(".stats-cards");

    // true or false based on whether user exists or not
    function validateUser(username){
        if(username.trim() === ""){
            alert("Username cannot be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
            if(!isMatching){
                alert("Invalid username format");
            }

        return isMatching;
    }
    async function fetchUserDetails(username){
         

            try{
            searchButton.disabled = true;
            searchButton.textContent = "Searching...";
            

            const proxyUrl = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = `https://leetcode.com/graphql/`;
            // concatinate proxyUrl and targetUrl
         const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
       const graphql=JSON.stringify({
        query: `query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
      totalSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
}`,
     variables: { username }
       })
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
        };
        const response = await fetch(proxyUrl + targetUrl, requestOptions);
            if(!response.ok){
                throw new Error("Enabled to fetch user details");
            }
            const parsedData = await response.json();
            console.log("fetched data:", parsedData);
            displayUserStats(parsedData);
        } catch (error) {
           statsContainer.innerHTML = `<p>${error.message}</p>`;
        }
        finally{
          searchButton.textContent = "Search";
            searchButton.disabled = false;
            
        }
    }
    function updateprogress(solved, total, label, circle){
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }
    
    function displayUserStats(parsedData){
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;
        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
      
        updateprogress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateprogress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateprogress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
      
      const cardData = [
        {label:"Overall Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
        {label:"Overall Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
        {label:"Overall Medium Submission", value: parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count},
        {label:"Overall Hard Submission", value: parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count},

        
      ];

      console.log("card ka data:", cardData);
      cardStatsContainer.innerHTML = cardData.map(
        data => {
            return `
            <div class="cards">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
            </div>
            `
        }
        ).join("");

      }
    searchButton.addEventListener("click", function() {
        const username = usernameInput.value;
        console.log("loggin username:", username);
        if((validateUser(username))){          
            // User is valid, proceed with the search
              fetchUserDetails(username);
        }
                

    });
});