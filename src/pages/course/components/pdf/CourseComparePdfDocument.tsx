import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { CourseComparePdfPayload } from './courseComparePdfTypes.ts'

const COLORS = {
  navy: '#344A64',
  secondary: '#6B8299',
  border: '#C5D6E3',
  headerBg: '#DAE5EA',
  labelBg: '#F4F8FA',
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansKR',
    fontSize: 9,
    color: COLORS.navy,
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 36,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  docMeta: {
    fontSize: 8,
    color: COLORS.secondary,
    marginBottom: 14,
  },
  courseList: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: COLORS.labelBg,
  },
  courseListTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 6,
  },
  courseItem: {
    fontSize: 8,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionHeader: {
    backgroundColor: COLORS.headerBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
  },
  table: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.border,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  labelCol: {
    width: '22%',
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: COLORS.labelBg,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  labelText: {
    fontSize: 8,
    color: COLORS.secondary,
  },
  headerLabelCol: {
    width: '22%',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#4A6278',
    justifyContent: 'center',
  },
  headerLabelText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#E8EEF2',
  },
  valueCol: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  headerValueCol: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#4A6278',
    justifyContent: 'center',
  },
  headerValueText: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.white,
    lineHeight: 1.35,
  },
  valueText: {
    fontSize: 8.5,
    fontWeight: 700,
    lineHeight: 1.35,
  },
  statsCell: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  statsLine: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.35,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    fontSize: 7,
    color: COLORS.secondary,
    textAlign: 'center',
  },
})

interface CourseComparePdfDocumentProps {
  data: CourseComparePdfPayload
}

function valueColWidth(courseCount: number) {
  const rest = 78 / courseCount
  return `${rest}%`
}

export default function CourseComparePdfDocument({ data }: CourseComparePdfDocumentProps) {
  const courseCount = data.courses.length
  const valueWidth = valueColWidth(courseCount)

  return (
    <Document title="과정 비교 결과" author="Bootsignal">
      <Page size="A4" style={styles.page}>
        <Text style={styles.docTitle}>과정 비교 결과서</Text>
        <Text style={styles.docMeta}>생성일시: {data.generatedAt}</Text>

        <View style={styles.courseList}>
          <Text style={styles.courseListTitle}>비교 대상 과정</Text>
          {data.courses.map((course) => (
            <Text key={course.index} style={styles.courseItem}>
              과정 {course.index} · {course.title} ({course.company}) · {course.dateRange}
            </Text>
          ))}
        </View>

        <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 10 }}>항목별 상세 비교</Text>

        {data.sections.map((section) => (
          <View key={section.label} style={styles.sectionBlock} wrap={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.headerLabelCol}>
                  <Text style={styles.headerLabelText}>항목</Text>
                </View>
                {data.courses.map((course) => (
                  <View key={`h-${course.index}`} style={[styles.headerValueCol, { width: valueWidth }]}>
                    <Text style={styles.headerValueText}>과정 {course.index}</Text>
                  </View>
                ))}
              </View>

              {section.rows.map((row) => (
                <View key={row.label} style={styles.tableRow}>
                  <View style={styles.labelCol}>
                    <Text style={styles.labelText}>{row.label}</Text>
                  </View>
                  {row.values.map((value, index) => (
                    <View key={`${row.label}-${index}`} style={[styles.valueCol, { width: valueWidth }]}>
                      <Text style={styles.valueText}>{value}</Text>
                    </View>
                  ))}
                </View>
              ))}

              {section.stats ? (
                <View style={styles.tableRow}>
                  <View style={styles.labelCol}>
                    <Text style={styles.labelText}>통계 비교</Text>
                  </View>
                  {section.stats.map((stats, index) => (
                    <View key={`stats-${index}`} style={[styles.valueCol, { width: valueWidth }]}>
                      <View style={styles.statsCell}>
                        <Text style={styles.statsLine}>
                          인증 후기 {stats.reviewCount}건 · 평균 {stats.averageRating.toFixed(1)}
                        </Text>
                        {stats.metrics.map((metric) => (
                          <Text key={metric.label} style={styles.statsLine}>
                            {metric.label} {metric.value.toFixed(1)}
                          </Text>
                        ))}
                        <Text style={[styles.statsLine, { color: COLORS.secondary }]}>* 5점 만점</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Bootsignal 과정 비교 · 본 문서는 비교 시점의 정보를 기준으로 생성되었습니다.
        </Text>
      </Page>
    </Document>
  )
}
