const Candidate = require("../models/candidate");
const User = require("../models/user");

// check user role admin or not
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

// Create a new candidate
exports.createCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have adim role" });

    const data = req.body; // body contains candidate data

    const newCandidate = new Candidate(data); // Create a new candidate document
    const response = await newCandidate.save(); // Save the new candidate to the database

    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have adim role" });

    const { candidateId } = req.params; // Extract the id from the URL parameter
    const updatedCandidateData = req.body; // Updated data for the candidate

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true, // Return the updated document
        runValidator: true, // Run mongoose validation
      },
    );

    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res
      .status(200)
      .json({ response, messsage: "Candidate updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have adim role" });

    const { candidateId } = req.params; // Extract the id from the URL parameter
    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res
      .status(200)
      .json({ response, message: "Candidate deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Submit only user vote at once time
exports.submitVote = async (req, res) => {
  // no admin can vote
  // user can only vote once
  const { candidateId } = req.params;
  const { id: userId } = req.user;

  try {
    // Find the Candidate document with the specified candidateId
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin is not allowed to vote" });
    }

    // Update the candidate document to record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // Update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Count candidate vote and sort candidate descending order by candidate voteCount
exports.countVotes = async (req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return their name and voteCount
    const voteRecord = candidates.map((candidate) => ({
      party: candidate.party,
      count: candidate.voteCount,
    }));

    res.status(200).json(voteRecord);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Find all candidate only name and party fields
exports.getCandidates = async (req, res) => {
  try {
    // Find all candidates and select only the name and party fields, exlcuding _id
    const candidates = await Candidate.find({}, "name party -_id");
    res.status(200).json(candidates);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
