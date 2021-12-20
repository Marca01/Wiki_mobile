import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";
import { FontAwesome } from "@expo/vector-icons";
import Accordion from "react-native-collapsible/Accordion";
const data_guide = [
  {
    title: "Tìm kiếm trên Google",
    syntax: ":search + nội dung muốn tìm",
    example: "':search chatbot là gì'",
    description: "Wiki sẽ giúp bạn tìm kiếm thông tin trên Google dễ dàng."
  },
  {
    title: "Tìm kiếm trên Wikipedia",
    syntax: ":wiki + nội dung muốn tìm",
    example: "':wiki xe hơi'",
    description: "Wiki sẽ tìm giúp bạn thông tin đã được tóm gọn lại bởi wikipedia."
  },
  {
    title: "Tính toán các phép tính đơn giản",
    syntax: "Bạn có thể hỏi các câu liên quan tới tính toán như '1 + 2 bằng mấy' hoặc chỉ đơn giản là nhắn '2 * 3'",
    example: "'23 * 78 bằng mấy?'",
    description: "Wiki sẽ giúp bạn tính toán các phép tính tưởng chừng như không hề khó mà lại khó không tưởng 😁."
  },
  {
    title: "Chuyển hình ảnh có chữ thành văn bản",
    syntax: ":totext hoặc :totext&eng + ảnh có chữ",
    example: "':totext + hình ảnh'",
    description: `Wiki sẽ giúp bạn chuyển đổi hình ảnh có chữ thành văn bản và có thể dễ dàng copy để dùng cho mục đích cá nhân. \nSẽ có 2 ngôn ngữ được chuyển thành văn bản là tiếng Việt và tiếng Anh. Ở đây :totext sẽ mặc định là tiếng Việt và :totext&eng sẽ là tiếng Anh.`
  },
  {
    title: "Gợi ý phim dựa trên thể loại",
    syntax: ":movie + thể loại phim",
    example: "':movie superhero'",
    description:
      "Wiki sẽ gợi ý các phim liên quan đến thể loại bạn nhập vào.     Lưu ý là phần lớn các phim được gợi ý là những phim cũ, có những       phim từ những năm 19xx :v do dữ liệu được sử dụng đã cũ."
  }
];

export default function Guide({ navigation }) {
  const [activeSection, setActiveSection] = useState([]);
  const GuideItem = ({ title, syntax, example, description }) => {
    return (
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp {syntax} {"\n"}
            Ví dụ: {example}
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>Mô tả: {description}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.guideHeader}>
        <View style={globalStyles.guideHeader_title}>
          <Text>Đây là trang hướng dẫn các tính năng của wiki chatbot</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="times" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Accordion
        sections={data_guide}
        activeSections={activeSection}
        renderHeader={section => <Text style={globalStyles.guideFeature_title}>{section.title}</Text>}
        renderContent={GuideItem}
        onChange={activeSections => setActiveSection(activeSections)}
        underlayColor="transparent"
      />
      {/* <FlatList ListFooterComponent={<View height={50} />} data={data_guide} renderItem={GuideItem} keyExtractor={(_, index) => index} /> */}
      {/* google search */}
    </View>
  );
}
