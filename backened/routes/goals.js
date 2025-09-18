import { emitNotification } from "./notifications.js";

// When user completes a goal
router.patch(
  "/:id/complete",
  verifyToken,
  asyncHandler(async (req, res) => {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "completed" },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // ✅ Notify the user themselves (congrats message)
    await emitNotification(req, {
      user: req.user.id,
      message: `🎉 Congrats! You completed your goal: "${goal.title}"`,
      type: "goal",
    });

    res.json(goal);
  })
);
