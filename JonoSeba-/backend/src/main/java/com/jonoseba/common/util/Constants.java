package com.jonoseba.common.util;

public class Constants {

    // User Roles
    public static final String ROLE_CITIZEN = "ROLE_CITIZEN";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_FIELD_WORKER = "ROLE_FIELD_WORKER";

    // Application Status
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_REVIEWING = "REVIEWING";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_REJECTED = "REJECTED";

    // Complaint Status
    public static final String COMPLAINT_STATUS_REPORTED = "REPORTED";
    public static final String COMPLAINT_STATUS_ASSIGNED = "ASSIGNED";
    public static final String COMPLAINT_STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLAINT_STATUS_RESOLVED = "RESOLVED";

    // Notification Types
    public static final String NOTIFICATION_APPLICATION_STATUS = "APPLICATION_STATUS";
    public static final String NOTIFICATION_COMPLAINT_UPDATE = "COMPLAINT_UPDATE";
    public static final String NOTIFICATION_ADMIN_MESSAGE = "ADMIN_MESSAGE";

    private Constants() {
    }
}
