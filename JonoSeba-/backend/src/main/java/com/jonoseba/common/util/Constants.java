package com.jonoseba.common.util;

public class Constants {

    // User Roles
    public static final String ROLE_CITIZEN = "CITIZEN";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_OFFICER = "OFFICER";

    // Application Status
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_REVIEW = "REVIEW";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_REJECTED = "REJECTED";

    // Complaint Status
    public static final String COMPLAINT_STATUS_NEW = "NEW";
    public static final String COMPLAINT_STATUS_ASSIGNED = "ASSIGNED";
    public static final String COMPLAINT_STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLAINT_STATUS_RESOLVED = "RESOLVED";
    public static final String COMPLAINT_STATUS_REJECTED = "REJECTED";

    // Notification Types
    public static final String NOTIFICATION_APPLICATION_STATUS = "APPLICATION_STATUS";
    public static final String NOTIFICATION_COMPLAINT_UPDATE = "COMPLAINT_UPDATE";
    public static final String NOTIFICATION_ADMIN_MESSAGE = "ADMIN_MESSAGE";

    // Complaint Categories
    public static final String CATEGORY_ROAD_DAMAGE = "ROAD_DAMAGE";
    public static final String CATEGORY_WATER_SUPPLY = "WATER_SUPPLY";
    public static final String CATEGORY_GARBAGE = "GARBAGE";
    public static final String CATEGORY_STREET_LIGHT = "STREET_LIGHT";
    public static final String CATEGORY_DRAINAGE = "DRAINAGE";
    public static final String CATEGORY_OTHER = "OTHER";

    private Constants() {
    }
}
