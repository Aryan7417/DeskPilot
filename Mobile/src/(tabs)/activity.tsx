
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";

const C = {
    bg: "#0B0D12",
    card: "#151922",
    border: "#292F3D",
    purple: "#7785FF",
    white: "#F5F7FA",
    muted: "#9299AA",
    green: "#4ADE80",
    orange: "#FBBF24",
};

const EVENTS = [
    {
        id: "1",
        title: "DeskPilot opened",
        detail: "Dashboard visited",
        time: "Just now",
        category: "System",
        icon: "✦",
        color: C.purple,
    },
    {
        id: "2",
        title: "Notepad launched",
        detail: "Windows application",
        time: "10 min ago",
        category: "Launches",
        icon: "↗",
        color: C.green,
    },
    {
        id: "3",
        title: "Application added",
        detail: "Brave Browser",
        time: "Yesterday",
        category: "Apps",
        icon: "＋",
        color: C.purple,
    },
    {
        id: "4",
        title: "Connection unavailable",
        detail: "Laptop is not connected",
        time: "Yesterday",
        category: "System",
        icon: "⌁",
        color: C.orange,
    },
];

const FILTERS = ["All", "Launches", "Apps", "System"];

export default function ActivityScreen() {
    const [selected, setSelected] = useState("All");

    const events =
        selected === "All"
            ? EVENTS
            : EVENTS.filter((event) => event.category === selected);

    return (
        <View style={s.screen}>
            <ScrollView
                contentContainerStyle={s.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={s.eyebrow}>YOUR WORKSPACE</Text>
                <Text style={s.title}>Activity</Text>
                <Text style={s.subtitle}>
                    Keep track of what happens in DeskPilot.
                </Text>

                <View style={s.summary}>
                    <View style={s.summaryIcon}>
                        <Text style={s.summarySymbol}>◷</Text>
                    </View>
                    <View style={s.summaryInfo}>
                        <Text style={s.summaryLabel}>RECENT EVENTS</Text>
                        <Text style={s.summaryValue}>{EVENTS.length} activities</Text>
                    </View>
                    <View style={s.previewBadge}>
                        <Text style={s.previewText}>DEMO</Text>
                    </View>
                </View>

                <Text style={s.sectionTitle}>ACTIVITY HISTORY</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={s.filters}
                >
                    {FILTERS.map((filter) => {
                        const active = selected === filter;

                        return (
                            <Pressable
                                key={filter}
                                onPress={() => setSelected(filter)}
                                style={[s.filter, active && s.activeFilter]}
                            >
                                <Text
                                    style={[
                                        s.filterText,
                                        active && s.activeFilterText,
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {events.length > 0 ? (
                    events.map((event, index) => (
                        <View key={event.id} style={s.eventRow}>
                            <View style={s.timeline}>
                                <View
                                    style={[
                                        s.eventIcon,
                                        { backgroundColor: `${event.color}20` },
                                    ]}
                                >
                                    <Text style={[s.eventSymbol, { color: event.color }]}>
                                        {event.icon}
                                    </Text>
                                </View>

                                {index !== events.length - 1 && (
                                    <View style={s.timelineLine} />
                                )}
                            </View>

                            <View style={s.eventCard}>
                                <View style={s.eventTop}>
                                    <Text style={s.eventTitle}>{event.title}</Text>
                                    <Text style={s.eventTime}>{event.time}</Text>
                                </View>

                                <Text style={s.eventDetail}>{event.detail}</Text>

                                <View style={s.eventFooter}>
                                    <View style={s.categoryBadge}>
                                        <Text style={s.categoryText}>{event.category}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={s.empty}>
                        <Text style={s.emptySymbol}>◷</Text>
                        <Text style={s.emptyTitle}>No activity here</Text>
                        <Text style={s.emptyText}>
                            Try selecting another category.
                        </Text>
                    </View>
                )}

                <View style={s.note}>
                    <Text style={s.noteTitle}>ⓘ  Preview data</Text>
                    <Text style={s.noteText}>
                        These are sample events for UI development. Real activity
                        history will be connected later.
                    </Text>
                </View>

                <Text style={s.footer}>DESKPILOT • ACTIVITY HISTORY</Text>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    screen: { flex: 1, backgroundColor: C.bg },
    content: { padding: 22, paddingTop: 32, paddingBottom: 40 },
    eyebrow: {
        color: C.purple,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2,
    },
    title: {
        color: C.white,
        fontSize: 30,
        fontWeight: "800",
        marginTop: 9,
    },
    subtitle: {
        color: C.muted,
        fontSize: 13,
        lineHeight: 21,
        marginTop: 8,
        marginBottom: 25,
    },
    summary: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.card,
        borderColor: C.border,
        borderWidth: 1,
        borderRadius: 17,
        padding: 16,
        marginBottom: 30,
    },
    summaryIcon: {
        width: 45,
        height: 45,
        borderRadius: 13,
        backgroundColor: "#252A46",
        alignItems: "center",
        justifyContent: "center",
    },
    summarySymbol: { color: C.purple, fontSize: 26 },
    summaryInfo: { flex: 1, marginLeft: 12 },
    summaryLabel: {
        color: C.muted,
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1,
    },
    summaryValue: {
        color: C.white,
        fontSize: 15,
        fontWeight: "700",
        marginTop: 5,
    },
    previewBadge: {
        backgroundColor: "#252A46",
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 8,
    },
    previewText: { color: C.purple, fontSize: 9, fontWeight: "800" },
    sectionTitle: {
        color: C.white,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.3,
        marginBottom: 16,
    },
    filters: { gap: 9, paddingBottom: 20 },
    filter: {
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.card,
        paddingHorizontal: 17,
        paddingVertical: 10,
        borderRadius: 11,
    },
    activeFilter: {
        backgroundColor: C.purple,
        borderColor: C.purple,
    },
    filterText: { color: C.muted, fontSize: 12, fontWeight: "600" },
    activeFilterText: { color: "#FFFFFF" },
    eventRow: { flexDirection: "row", minHeight: 106 },
    timeline: { width: 49, alignItems: "center" },
    eventIcon: {
        width: 39,
        height: 39,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    eventSymbol: { fontSize: 20, fontWeight: "700" },
    timelineLine: {
        position: "absolute",
        top: 41,
        bottom: 0,
        width: 1,
        backgroundColor: C.border,
    },
    eventCard: {
        flex: 1,
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 15,
        padding: 13,
        marginBottom: 13,
    },
    eventTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
    },
    eventTitle: {
        flex: 1,
        color: C.white,
        fontSize: 12,
        fontWeight: "700",
    },
    eventTime: { color: C.muted, fontSize: 9 },
    eventDetail: { color: C.muted, fontSize: 11, marginTop: 7 },
    eventFooter: { marginTop: 12, flexDirection: "row" },
    categoryBadge: {
        backgroundColor: "#22263A",
        borderRadius: 7,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    categoryText: { color: C.purple, fontSize: 9, fontWeight: "700" },
    empty: {
        alignItems: "center",
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        padding: 30,
    },
    emptySymbol: { color: C.muted, fontSize: 32 },
    emptyTitle: { color: C.white, fontSize: 15, fontWeight: "700", marginTop: 10 },
    emptyText: { color: C.muted, fontSize: 11, marginTop: 6 },
    note: {
        backgroundColor: "#1B2030",
        borderColor: "#343D64",
        borderWidth: 1,
        borderRadius: 13,
        padding: 14,
        marginTop: 15,
    },
    noteTitle: { color: C.white, fontSize: 12, fontWeight: "700" },
    noteText: { color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 7 },
    footer: {
        color: "#596174",
        fontSize: 9,
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 27,
    },
});
