package com.t2404e.aihealthcoach.ai.fallback;

import com.t2404e.aihealthcoach.dto.response.ai.*;

import java.util.List;
public class HealthAnalysisFallbackFactory {

    public static AiHealthAnalysisResponse defaultResponse() {

        BodyAnalysis analysis = new BodyAnalysis();
        analysis.setBmi(0.0);
        analysis.setBmr(0.0);
        analysis.setTdee(0.0);
        analysis.setHealthStatus("UNKNOWN");
        analysis.setSummary("Không thể phân tích dữ liệu sức khỏe tại thời điểm này.");

        LifestyleInsights insights = new LifestyleInsights();
        insights.setActivity("Chưa có dữ liệu.");
        insights.setSleep("Chưa có dữ liệu.");
        insights.setStress("Chưa có dữ liệu.");

        MonthlyPlanPhase phase = new MonthlyPlanPhase();
        phase.setMonth(1);
        phase.setTitle("Ổn định");
        phase.setDailyCalories(2000); // Integer OK
        phase.setNote("Hệ thống sẽ cập nhật kế hoạch khi có thêm dữ liệu.");

        ThreeMonthPlan plan = new ThreeMonthPlan();
        plan.setGoal("MAINTENANCE");
        plan.setTotalTargetWeightChangeKg(0.0); // Double OK
        plan.setMonths(List.of(phase));

        AiHealthAnalysisResponse response = new AiHealthAnalysisResponse();
        response.setAnalysis(analysis);
        response.setLifestyleInsights(insights);
        response.setThreeMonthPlan(plan);

        return response;
    }
}
